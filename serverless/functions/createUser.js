exports.handler = async function (context, event, callback) {
  const axios = require("axios");
  const response = new Twilio.Response();
  response.appendHeader("Content-Type", "application/json");
  response.setStatusCode(201);

  const { userID } = event;

  if (!userID) {
    response.setStatusCode(400);
    response.setBody({
      message: "No userID present! Couldn't create new user!",
    });
    return callback(null, response);
  }

  const existingUser = null;

  try {
    existingUser = (
      await axios.get(
        `https://api.airtable.com/v0/appGV5RdFcKE1Oor0/tblrtLqdM9L3h9exW?fields%5B%5D=username&filterByFormula=username%3D%22${userID}%22&maxrecords=1`,
        {
          headers: {
            Authorization: `Bearer ${context.DB_KEY}`,
          },
        }
      )
    ).data.records[0];
  } catch (e) {
    console.log("Capture error!");
    // ignore error
  }

  if (existingUser) {
    response.setStatusCode(400);
    response.setBody({
      message: "User already exists! Cannot create a duplicate user!",
    });
    return callback(null, response);
  }

  console.log(context.DB_KEY);

  const crypto = require("crypto");

  const newUser = {
    username: userID,
    safetyDepositBoxes: "[]",
    contingents: "[]",
  };

  const sdbCipher = crypto.createCipheriv(
    context.DB_ENCRYPTION_ALGORITHM,
    context.DB_ENCRYPTION_PK,
    context.DB_ENCRYPTION_IVEC
  );

  const contingentCipher = crypto.createCipheriv(
    context.DB_ENCRYPTION_ALGORITHM,
    context.DB_ENCRYPTION_PK,
    context.DB_ENCRYPTION_IVEC
  );

  newUser.safetyDepositBoxes = sdbCipher.update(
    newUser.safetyDepositBoxes,
    "utf8",
    "hex"
  );
  newUser.safetyDepositBoxes += sdbCipher.final("hex");

  newUser.contingents = contingentCipher.update(
    newUser.contingents,
    "utf8",
    "hex"
  );
  newUser.contingents += contingentCipher.final("hex");

  console.log(newUser);

  try {
    await axios.post(
      "https://api.airtable.com/v0/appGV5RdFcKE1Oor0/users",
      {
        fields: newUser,
      },
      {
        headers: {
          Authorization: `Bearer ${context.DB_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return callback(null, response);
  } catch (e) {
    console.log("Creation error!");
    return callback(e, null);
  }
};
