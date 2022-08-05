// Calls the Twilio Serverless Toolkit Function and returns the JSON response
async function getToFunction(functionName, accessToken) {
  try {
    const response = await fetch(functionName, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
    const jsonData = await response.json();

    return jsonData;
  } catch (err) {
    console.error(err);
  }
}

async function postToFunction(functionName, data, accessToken) {
  try {
    const response = await fetch(functionName, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ body: { ...data } }),
    });

    return response;
  } catch (err) {
    console.error(err);
  }
}

export async function getUserSafetyDepositBoxes(accessToken) {
  const safetyDepositBoxes = await getToFunction(
    "/getSafetyDepositBoxes",
    accessToken
  );

  return safetyDepositBoxes;
}

export async function getUserContingents(accessToken) {
  const contingents = await getToFunction("/getContingents", accessToken);

  return contingents;
}

export async function getLinkedSafetyDepositBox(linkUUID) {
  const response = await getToFunction(
    `/getLinkedSafetyDepositBox?body=${linkUUID}`
  );

  return response;
}

export async function getAccessToken(userIdentity) {
  const response = await getToFunction(`/getAccessToken?body=${userIdentity}`);

  return response;
}

export async function createSafetyDepositBox(accessToken, newSafetyDepositBox) {
  const response = await postToFunction(
    "/createSafetyDepositBox",
    newSafetyDepositBox,
    accessToken
  );

  return response;
}

export async function createContingent(accessToken, newContingent) {
  const response = await postToFunction(
    "/createContingent",
    newContingent,
    accessToken
  );

  return response;
}

export async function deleteUser(accessToken) {
  const response = await postToFunction("/deleteUser", {}, accessToken);

  return response;
}
