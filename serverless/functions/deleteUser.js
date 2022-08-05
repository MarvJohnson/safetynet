exports.handler = async function (context, event, callback) {
  const authPath = Runtime.getFunctions()["auth"].path;
  const auth = require(authPath);
  const authHeader = event.request.headers.authorization;
  const jwtAlgorithm = context.TWILIO_AUTH_ALGORITHM;
  const crypto = require("crypto");
  const axios = require("axios");
  const response = new Twilio.Response();
  response.setStatusCode(200);
  response.appendHeader("Content-Type", "application/json");

  console.log("Running!");

  const authorizedUserID = await auth.getAuthorizedUser(
    authHeader,
    jwtAlgorithm
  );

  const ManagementClient = require("auth0").ManagementClient;

  const management = new ManagementClient({
    domain: context.REACT_APP_AUTH0_DOMAIN,
    clientId: context.AUTH0_BACKEND_CLIENT_ID,
    clientSecret: context.AUTH0_BACKEND_CLIENT_SECRET,
    scope: "delete:users",
  });

  console.log("Management Client created!");

  await management.deleteUser({
    id: authorizedUserID,
  });

  console.log("Sent request!");

  const existingUser = (
    await axios.get(
      `https://api.airtable.com/v0/appGV5RdFcKE1Oor0/users?fields%5B%5D=username&filterByFormula=username%3D%22${authorizedUserID}%22&maxRecords=1`,
      {
        headers: {
          Authorization: `Bearer ${context.DB_KEY}`,
        },
      }
    )
  ).data.records[0];

  if (!existingUser) {
    response.setStatusCode(400);
    response.setBody({ message: "Cannot delete non-existant user!" });
    return callback(null, response);
  }

  await axios.delete(
    `https://api.airtable.com/v0/appGV5RdFcKE1Oor0/users/${existingUser.id}`,
    {
      headers: {
        Authorization: `Bearer ${context.DB_KEY}`,
      },
    }
  );

  response.setBody({ message: "User successfully deleted!" });

  return callback(null, response);
};
