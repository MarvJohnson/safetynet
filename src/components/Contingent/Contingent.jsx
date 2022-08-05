import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./styling.css";
import { Heading } from "@twilio-paste/core/heading";
import { Box } from "@twilio-paste/core/box";
import { Stack } from "@twilio-paste/core/stack";
import Input from "../../components/Input/Input";

export default function Contingent() {
  const contingent = useLocation().state;

  return (
    <main className="contingent-details">
      <Heading as="h1" variant="heading10">
        Contingent
      </Heading>

      <Box as="div" className="input-list">
        <Stack orientation="vertical" spacing="space40">
          {Object.getOwnPropertyNames(contingent).map((propertyName) => (
            <Input
              label={propertyName}
              type="text"
              placeholder={contingent[propertyName]}
              hasOptions={false}
              disabled={true}
            />
          ))}
        </Stack>
      </Box>
    </main>
  );
}
