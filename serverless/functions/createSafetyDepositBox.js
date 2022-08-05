// This is your new function. To start, set the name and path on the left.

exports.handler = async function (context, event, callback) {
  try {
    const authPath = Runtime.getFunctions()["auth"].path;
    const auth = require(authPath);
    const authHeader = event.request.headers.authorization;
    const jwtAlgorithm = context.TWILIO_AUTH_ALGORITHM;
    const axios = require("axios");
    const crypto = require("crypto");
    const response = new Twilio.Response();
    response.setStatusCode(201);

    const dbAPI = context.DB_API;
    const newSafetyDepositBox = event.body;

    const authorizedUserID = await auth.getAuthorizedUser(
      authHeader,
      jwtAlgorithm
    );

    const user =
      (
        await axios.get(
          `${dbAPI}users?fields%5B%5D=safetyDepositBoxes&filterByFormula=username%3D%22${authorizedUserID}%22&maxRecords=1`,
          {
            headers: {
              Authorization: `Bearer ${context.DB_KEY}`,
            },
          }
        )
      ).data.records[0] ?? {};

    // Can't patch database element if the createdTime property exists in the POST body
    if (user.createdTime) delete user.createdTime;
    let userSafetyDepositBoxes = user.fields?.safetyDepositBoxes
      ? user.fields?.safetyDepositBoxes
      : [];

    const decipher = crypto.createDecipheriv(
      context.DB_ENCRYPTION_ALGORITHM,
      context.DB_ENCRYPTION_PK,
      context.DB_ENCRYPTION_IVEC
    );

    userSafetyDepositBoxes = decipher.update(
      userSafetyDepositBoxes,
      "hex",
      "utf8"
    );
    userSafetyDepositBoxes += decipher.final("utf8");
    console.log(userSafetyDepositBoxes);
    userSafetyDepositBoxes = JSON.parse(userSafetyDepositBoxes);
    console.log(userSafetyDepositBoxes);

    newSafetyDepositBox.linkUUID = (
      await axios.post(
        "https://api.airtable.com/v0/appGV5RdFcKE1Oor0/safety%20deposit%20box%20link%20mappings",
        {
          records: [
            {
              fields: {
                owner: user.id,
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
      )
    ).data.records[0].id;

    if (
      userSafetyDepositBoxes.some(
        (box) => newSafetyDepositBox["boxName"] === box["boxName"]
      )
    ) {
      response.setStatusCode(400);
      response.appendHeader("Content-Type", "application/json");
      response.setBody(
        "Can't create duplicate Safety Deposit Boxes (names must be different)!"
      );

      return callback(null, response);
    }
    const cipher = crypto.createCipheriv(
      context.DB_ENCRYPTION_ALGORITHM,
      context.DB_ENCRYPTION_PK,
      context.DB_ENCRYPTION_IVEC
    );

    let newUserSafetyDepositBoxes = cipher.update(
      JSON.stringify([...userSafetyDepositBoxes, newSafetyDepositBox]),
      "utf8",
      "hex"
    );

    newUserSafetyDepositBoxes += cipher.final("hex");

    await axios.patch(
      `https://api.airtable.com/v0/appGV5RdFcKE1Oor0/users/${user.id}`,
      {
        fields: {
          ...user.fields,
          safetyDepositBoxes: newUserSafetyDepositBoxes,
        },
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
