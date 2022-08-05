const AccessToken = require("twilio").jwt.AccessToken;
const SyncGrant = AccessToken.SyncGrant;

module.exports = (identity, accountSid, apiKey, apiSecret, serviceSid) => {
  const syncGrant = new SyncGrant({
    serviceSid,
  });
  const tokenSetup = new AccessToken(accountSid, apiKey, apiSecret);

  tokenSetup.addGrant(syncGrant);
  tokenSetup.identity = identity;
  const token = tokenSetup.toJwt();

  return token;
};
