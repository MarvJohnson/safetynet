// This is your new function. To start, set the name and path on the left.

exports.handler = async function (context, event, callback) {
  try {
    const authPath = Runtime.getFunctions()["auth"].path;
    const auth = require(authPath);
    const authHeader = event.request.headers.authorization;
    const jwtAlgorithm = context.TWILIO_AUTH_ALGORITHM;
    const axios = require("axios");
    const response = new Twilio.Response();
    response.setStatusCode(201);

    const dbAPI = context.DB_API;
    const newContingent = event.body;

    const authorizedUserID = await auth.getAuthorizedUser(
      authHeader,
      jwtAlgorithm
    );

    const user =
      (
        await axios.get(
          `https://api.airtable.com/v0/appGV5RdFcKE1Oor0/users?fields%5B%5D=contingents&filterByFormula=username%3D%22${authorizedUserID}%22&maxRecords=1`,
          {
            headers: {
              Authorization: `Bearer ${context.DB_KEY}`,
            },
          }
        )
      ).data.records[0] ?? {};

    // Can't patch database element if the createdTime property exists in the POST body
    if (user.createdTime) delete user.createdTime;

    let userContingents = user.fields?.contingents
      ? user.fields?.contingents
      : [];

    const crypto = require("crypto");
    const decipher = crypto.createDecipheriv(
      context.DB_ENCRYPTION_ALGORITHM,
      context.DB_ENCRYPTION_PK,
      context.DB_ENCRYPTION_IVEC
    );
    userContingents = decipher.update(userContingents, "hex", "utf8");
    userContingents += decipher.final("utf8");
    console.log(userContingents);
    userContingents = JSON.parse(userContingents);

    if (
      userContingents.some(
        (contingent) =>
          newContingent["phoneNumber"] === contingent["phoneNumber"]
      )
    ) {
      response.setStatusCode(400);
      response.setHeaders({
        "Content-Type": "application/json",
      });
      response.setBody(
        "Can't create duplicate Contengents (phone numbers must be different)!"
      );

      return callback(null, response);
    }

    let newContingents = JSON.stringify([...userContingents, newContingent]);

    const cipher = crypto.createCipheriv(
      context.DB_ENCRYPTION_ALGORITHM,
      context.DB_ENCRYPTION_PK,
      context.DB_ENCRYPTION_IVEC
    );
    newContingents = cipher.update(newContingents, "utf8", "hex");
    newContingents += cipher.final("hex");

    await axios.patch(
      `https://api.airtable.com/v0/appGV5RdFcKE1Oor0/users`,
      {
        records: [
          {
            ...user,
            fields: {
              ...user.fields,
              contingents: newContingents,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DB_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return callback(null, response);
  } catch (err) {
    return callback(err, null);
  }
};
