// This is your new function. To start, set the name and path on the left.

exports.handler = function (context, event, callback) {
  try {
    const response = new Twilio.Response();
    response.appendHeader("Content-Type", "application/json");
    response.setStatusCode(200);
    const userIdentity = event.body;
    const createAccessTokenPath =
      Runtime.getAssets()["/assets/utils/createAccessToken.js"].path;
    const accessToken = require(createAccessTokenPath)(
      userIdentity,
      context.TWILIO_ACCOUNT_SID,
      context.TWILIO_SYNC_API_KEY,
      context.TWILIO_SYNC_API_SECRET,
      context.TWILIO_SYNC_SERVICE_SID
    );
    response.setBody(accessToken);

    return callback(null, response);
  } catch (err) {
    return callback(err, null);
  }
};
