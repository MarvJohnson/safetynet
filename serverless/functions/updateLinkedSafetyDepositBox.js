// This is your new function. To start, set the name and path on the left.

exports.handler = async function (context, event, callback) {
  try {
    const twilioClient = context.getTwilioClient();
    const { Body: message, From: respondent } = event;
    const userIdentity = respondent;
    const createAccessTokenPath =
      Runtime.getAssets()["/assets/utils/createAccessToken.js"].path;
    const response = new Twilio.Response();
    const accessToken = require(createAccessTokenPath)(
      userIdentity,
      context.TWILIO_ACCOUNT_SID,
      context.TWILIO_SYNC_API_KEY,
      context.TWILIO_SYNC_API_SECRET,
      context.TWILIO_SYNC_SERVICE_SID
    );
    const { SyncClient } = require("twilio-sync");
    const syncClient = new SyncClient(accessToken);

    console.log(respondent);

    let phoneSyncDocument = null;

    try {
      phoneSyncDocument = await syncClient.document({
        id: respondent,
        mode: "open_existing",
      });
    } catch (err) {
      console.log(err);
      await twilioClient.messages.create({
        body: "There are no requested documents!",
        to: respondent,
        from: context.TWILIO_SYNC_PHONE,
      });
      return callback(null, { status: 400, message: "No requested documents" });
    }

    console.log(phoneSyncDocument.data);

    if (message.toLowerCase().trim() === "yes") {
      const syncDocument = await syncClient.document({
        id: phoneSyncDocument.data.requests[
          phoneSyncDocument.data.requests.length - 1
        ].syncDocumentUUID,
        mode: "open_existing",
      });

      const newData = {
        ...syncDocument.data,
        safetyDepositBox:
          phoneSyncDocument.data.requests[
            phoneSyncDocument.data.requests.length - 1
          ].requestedData,
        approval: true,
      };

      const update = await syncDocument.update(newData);
      console.log(update);
      await twilioClient.messages.create({
        body: "Approval received!",
        to: respondent,
        from: context.TWILIO_SYNC_PHONE,
      });

      await phoneSyncDocument.removeDocument();
      console.log("Phone Sync Document deleted!");
    }

    response.setStatusCode(200);

    return callback(null, response);
  } catch (err) {
    return callback(err, null);
  }
};
