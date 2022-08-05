const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

exports.getAuthorizedUser = async (authHeader, jwtAlgorithm) => {
  try {
    if (!authHeader)
      throw new Error("Auth header is missing! Bearer token must be present!");

    const [authType, authToken] = authHeader.split(" ");

    if (authType.toLowerCase() !== "bearer")
      throw new Error("Bearer token missing or incorrectly formatted!");

    const client = jwksClient({
      jwksUri: "https://dev-fnqnffrh.us.auth0.com/.well-known/jwks.json",
    });

    const decodedAuthToken = jwt.decode(authToken, {
      complete: true,
    });

    const key = await client.getSigningKey(decodedAuthToken.header.kid);
    const signingKey = key.getPublicKey();

    const token = jwt.verify(authToken, signingKey, {
      algorithms: [jwtAlgorithm],
      complete: true,
    });

    return token.payload.sub;
  } catch (e) {
    console.log(e);
  }
};
