import "./styling.css";
import { useLocation } from "react-router-dom";
import { Heading } from "@twilio-paste/core/heading";
import { Stack } from "@twilio-paste/core/stack";
import { Box } from "@twilio-paste/core/box";
import Input from "../Input/Input";
import { withAuthenticationRequired } from "@auth0/auth0-react";

function SafetyDepositBox() {
  const box = useLocation().state;

  return (
    <main className="safety-deposit-box-details">
      <Heading as="h1" variant="heading10">
        Safety Deposit Box
      </Heading>

      <Box as="div" className="safety-deposit-box-input-list">
        <Stack orientation="vertical" spacing="space40">
          {Object.getOwnPropertyNames(box).map((propertyName) =>
            propertyName !== "contingents" ? (
              <Input
                label={propertyName}
                type="text"
                placeholder={box[propertyName]}
                hasOptions={false}
                disabled={true}
              />
            ) : (
              <Box>
                <Heading as="h3" variant="heading30">
                  Contingents
                </Heading>
                <Stack orientation="vertical" spacing="space30">
                  {box.contingents.map((contingent) => (
                    <Input
                      type="text"
                      placeholder={`${contingent.firstName} ${contingent.lastName} (${contingent.phoneNumber})`}
                      hasOptions={false}
                      disabled={true}
                    />
                  ))}
                </Stack>
              </Box>
            )
          )}
          <p>{`Full Link: https://safetynet-6147-dev.twil.io/#/sdb/${box.linkUUID}`}</p>
        </Stack>
      </Box>
    </main>
  );
}

export default withAuthenticationRequired(SafetyDepositBox);
