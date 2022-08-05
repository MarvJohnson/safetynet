import React, { useState, useEffect } from "react";
import "./styling.css";
import { useNavigate } from "react-router-dom";
import { Heading } from "@twilio-paste/core/heading";
import { Stack } from "@twilio-paste/core/stack";
import { Button } from "@twilio-paste/core/button";
import { getUserContingents } from "../../services/userServices";
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";

function Contingents() {
  const [contingents, setContingents] = useState([]);
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  async function initialize() {
    const accessToken = await getAccessTokenSilently({
      audience: "https://safetynet-6147-dev.twil.io/",
      scope: "read:user",
    });

    const contingents = await getUserContingents(accessToken);
    setContingents(contingents);
  }

  useEffect(() => {
    initialize();
  }, [getAccessTokenSilently]);

  return (
    <main className="contingents-page">
      <Heading as="h1" variant="heading10">
        Contingents
      </Heading>

      <Button
        variant="primary"
        onClick={() => {
          navigate("new");
        }}
      >
        Create a new Contingent!
      </Button>

      <hr />

      {contingents.length > 0 ? (
        <div className="contingent-list">
          <Stack orientation="vertical" spacing="space60">
            {contingents.map((contingent, idx) => (
              <Button
                key={contingent["firstName"] + idx}
                variant="secondary"
                fullWidth={true}
                onClick={() => {
                  navigate(contingent["firstName"], { state: contingent });
                }}
              >
                {contingent["firstName"]} - {contingent["lastName"]}
              </Button>
            ))}
          </Stack>
        </div>
      ) : (
        <p className="contingent-list-empty">
          There are no contingents to show! Create new contingents for them to
          be listed here.
        </p>
      )}
    </main>
  );
}

export default withAuthenticationRequired(Contingents);
