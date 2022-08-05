// This is your new function. To start, set the name and path on the left.

exports.handler = async function (context, event, callback) {
  try {
    const axios = require("axios");
    const crypto = require("crypto");
    const response = new Twilio.Response();
    const twilioClient = context.getTwilioClient();
    const syncServiceSid = context.TWILIO_SYNC_SERVICE_SID;
    const syncTtl = Number(context.TWILIO_SYNC_TIMEOUT);
    const userIdentity = event.body;
    const createAccessTokenPath =
      Runtime.getAssets()["/assets/utils/createAccessToken.js"].path;
    const accessToken = require(createAccessTokenPath)(
      userIdentity,
      context.TWILIO_ACCOUNT_SID,
      context.TWILIO_SYNC_API_KEY,
      context.TWILIO_SYNC_API_SECRET,
      syncServiceSid
    );
    const { SyncClient } = require("twilio-sync");
    const syncClient = new SyncClient(accessToken);

    response.setHeaders({
      "Content-Type": "application/json",
    });
    response.setStatusCode(201);

    const safetyDepositBoxLinkUUID = event.body;

    const safetyDepositBoxLinkOwner = (
      await axios.get(
        `https://api.airtable.com/v0/appGV5RdFcKE1Oor0/safety%20deposit%20box%20link%20mappings/${safetyDepositBoxLinkUUID}`,
        {
          headers: {
            Authorization: `Bearer ${context.DB_KEY}`,
          },
        }
      )
    ).data.fields.owner;

    let userSafetyDepositBoxes = (
      await axios.get(
        `https://api.airtable.com/v0/appGV5RdFcKE1Oor0/users/${safetyDepositBoxLinkOwner}`,
        {
          headers: {
            Authorization: `Bearer ${context.DB_KEY}`,
          },
        }
      )
    ).data.fields.safetyDepositBoxes;

    const sdbDecipher = crypto.createDecipheriv(
      context.DB_ENCRYPTION_ALGORITHM,
      context.DB_ENCRYPTION_PK,
      context.DB_ENCRYPTION_IVEC
    );
    userSafetyDepositBoxes = sdbDecipher.update(
      userSafetyDepositBoxes,
      "hex",
      "utf8"
    );
    userSafetyDepositBoxes += sdbDecipher.final("utf8");
    userSafetyDepositBoxes = JSON.parse(userSafetyDepositBoxes);

    const safetyDepositBox = userSafetyDepositBoxes.find(
      (box) => box.linkUUID === safetyDepositBoxLinkUUID
    );

    const contingentsPhoneNumbers = safetyDepositBox.contingents.map(
      (contingent) => contingent.phoneNumber
    );
    console.log(contingentsPhoneNumbers);

    delete safetyDepositBox.contingents;
    delete safetyDepositBox.linkUUID;

    // User follows link to SDB
    // Need to create sync state between user and contingents
    // Sync state should signal for when a contingent has agreed to allow the user to open the SDB
    const syncService = Runtime.getSync({
      serviceName: syncServiceSid,
    });

    const syncDocumentUUID = crypto.randomUUID();

    await syncService.documents.create({
      uniqueName: syncDocumentUUID,
      ttl: syncTtl,
      data: {},
    });

    // const syncDocument = await syncClient.document(syncDocumentUUID);
    for (let i = 0; i < contingentsPhoneNumbers.length; i++) {
      const phoneNumber = contingentsPhoneNumbers[i];
      let phoneSyncDocument = null;

      try {
        phoneSyncDocument = await syncClient.document({
          id: phoneNumber,
          mode: "open_existing",
        });
        const newData = {
          ...phoneSyncDocument.data,
          requests: [
            ...phoneSyncDocument.data.requests,
            { syncDocumentUUID, requestedData: safetyDepositBox },
          ],
        };
        await phoneSyncDocument.update(newData);
      } catch (err) {
        if (err.status === 404) {
          phoneSyncDocument = await syncService.documents.create({
            uniqueName: phoneNumber,
            ttl: syncTtl,
            data: {
              requests: [{ syncDocumentUUID, requestedData: safetyDepositBox }],
            },
          });
        }
      }

      await twilioClient.messages.create({
        body: "SDB approval requested!\n\nReply 'Yes' to grant approval, or ignore this message.",
        to: phoneNumber,
        from: context.TWILIO_SYNC_PHONE,
      });
    }

    response.setBody({ syncDocumentUUID });

    return callback(null, response);
  } catch (err) {
    if (err.response?.status === 404)
      return callback(null, {
        status: 404,
        ttl: syncTtl,
        data: "The link you entered is invalid!",
      });

    return callback(err, null);
  }
};
