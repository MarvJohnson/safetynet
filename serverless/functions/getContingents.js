// This is your new function. To start, set the name and path on the left.

exports.handler = async function (context, event, callback) {
  try {
    const authPath = Runtime.getFunctions()["auth"].path;
    const auth = require(authPath);
    const authHeader = event.request.headers.authorization;
    const jwtAlgorithm = context.TWILIO_AUTH_ALGORITHM;
    const axios = require("axios");
    const dbAPI = context.DB_API;
    const dbKey = context.DB_KEY;
    const authorizedUserID = await auth.getAuthorizedUser(
      authHeader,
      jwtAlgorithm
    );
    const databaseResponse = await axios.get(
      `https://api.airtable.com/v0/appGV5RdFcKE1Oor0/users?fields%5B%5D=contingents&filterByFormula=username%3D%22${authorizedUserID}%22&maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${dbKey}`,
        },
      }
    );

    let contingents =
      databaseResponse.data?.records[0]?.fields?.contingents ?? [];

    const crypto = require("crypto");
    const decipher = crypto.createDecipheriv(
      context.DB_ENCRYPTION_ALGORITHM,
      context.DB_ENCRYPTION_PK,
      context.DB_ENCRYPTION_IVEC
    );

    contingents = decipher.update(contingents, "hex", "utf8");
    contingents += decipher.final("utf8");
    console.log(contingents);

    return callback(null, contingents);
  } catch (err) {
    return callback(err, null);
  }
};
