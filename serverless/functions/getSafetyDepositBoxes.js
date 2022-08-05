// This is your new function. To start, set the name and path on the left.

exports.handler = async function (context, event, callback) {
  try {
    const authPath = Runtime.getFunctions()["auth"].path;
    const auth = require(authPath);
    const authHeader = event.request.headers.authorization;
    const crypto = require("crypto");
    const jwtAlgorithm = context.TWILIO_AUTH_ALGORITHM;
    const axios = require("axios");

    const authorizedUserID = await auth.getAuthorizedUser(
      authHeader,
      jwtAlgorithm
    );

    const dbAPI = context.DB_API;
    const databaseResponse = await axios.get(
      `https://api.airtable.com/v0/appGV5RdFcKE1Oor0/users?fields%5B%5D=safetyDepositBoxes&filterByFormula=username%3D%22${authorizedUserID}%22&maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${context.DB_KEY}`,
        },
      }
    );

    const decipher = crypto.createDecipheriv(
      context.DB_ENCRYPTION_ALGORITHM,
      context.DB_ENCRYPTION_PK,
      context.DB_ENCRYPTION_IVEC
    );

    let safetyDepositboxes = decipher.update(
      String(
        databaseResponse?.data?.records[0]?.fields?.safetyDepositBoxes ?? []
      ),
      "hex",
      "utf-8"
    );

    safetyDepositboxes += decipher.final("utf-8");

    console.log(safetyDepositboxes);

    safetyDepositboxes = JSON.parse(safetyDepositboxes);

    return callback(null, safetyDepositboxes);
  } catch (err) {
    return callback(err, null);
  }
};
