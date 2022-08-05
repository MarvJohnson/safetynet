import React, { useState, useEffect } from "react";
import "./styling.css";
import { getUserSafetyDepositBoxes } from "../../services/userServices";
import { useNavigate } from "react-router-dom";
import { Button } from "@twilio-paste/core/button";
import { Stack } from "@twilio-paste/core/stack";
import { Heading } from "@twilio-paste/core/heading";
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";

function SafetyDepositBoxes() {
  const [boxes, setBoxes] = useState([]);
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  async function initialize() {
    const accessToken = await getAccessTokenSilently({
      audience: "https://safetynet-6147-dev.twil.io/",
      scope: "read:user",
    });

    const safetyDepositBoxes = await getUserSafetyDepositBoxes(accessToken);
    setBoxes(safetyDepositBoxes);
  }

  useEffect(() => {
    initialize();
  }, [getAccessTokenSilently]);

  return (
    <main className="safety-deposit-boxes-page">
      <Heading as="h1" variant="heading10">
        Safety Deposit Boxes
      </Heading>

      <Button
        variant="primary"
        onClick={() => {
          navigate("new");
        }}
      >
        Create a new Safety Deposit Box!
      </Button>

      <hr />

      {boxes.length > 0 ? (
        <div className="safety-deposit-box-list">
          <Stack orientation="vertical" spacing="space60">
            {boxes.map((box) => (
              <Button
                key={box["boxName"]}
                variant="secondary"
                fullWidth={true}
                onClick={() => {
                  navigate(box["boxName"], { state: box });
                }}
              >
                {box["boxName"]}
              </Button>
            ))}
          </Stack>
        </div>
      ) : (
        <p className="safety-deposit-box-list-empty">
          There are no safety deposit boxes to show! Create new safety deposit
          boxes for them to be listed here.
        </p>
      )}
    </main>
  );
}

export default withAuthenticationRequired(SafetyDepositBoxes);
