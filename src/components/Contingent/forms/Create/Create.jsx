import React, { useState } from "react";
import "./styling.css";
import Input from "../../../Input/Input";
import { Link, useNavigate } from "react-router-dom";
import { CloseCircleIcon } from "@twilio-paste/icons/cjs/CloseCircleIcon";
import { Heading } from "@twilio-paste/core/heading";
import { Button } from "@twilio-paste/core/button";
import { Stack } from "@twilio-paste/core/stack";
import { Box } from "@twilio-paste/core/box";
import camelCase from "lodash/camelCase";
import { createContingent } from "../../../../services/userServices";
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";

function Create() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const inputs = Array.from(e.target.elements)
      .filter((input) => input.tagName === "INPUT")
      .map((input) => ({
        [camelCase(input.name).replace("-", "")]: input.value,
      }));

    const newContingent = inputs.reduce(
      (box, nextInput) => ({
        ...box,
        ...nextInput,
      }),
      {}
    );

    const accessToken = await getAccessTokenSilently({
      audience: "https://safetynet-6147-dev.twil.io/",
      scope: "read:user",
    });

    const response = await createContingent(accessToken, newContingent);

    if (response.status === 200 || response.status === 201) navigate("../");

    setLoading(false);
  }

  return (
    <main className="contingent-create">
      <Heading as="h1" variant="heading10">
        New Contingent
      </Heading>

      <form
        className="contingent-form"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <Stack orientation="horizontal" spacing="space30">
          <Button type="submit" variant="primary" loading={loading}>
            Create Contingent
          </Button>
          <Link to="../">
            <Button variant="destructive">
              Cancel
              <CloseCircleIcon title="Cancel Contingent creation" />
            </Button>
          </Link>
        </Stack>

        <Box as="div" className="input-list">
          <Stack orientation="vertical" spacing="space40">
            <Input
              label="first name"
              type="text"
              placeholder="John"
              hasOptions={false}
              required={true}
            />
            <Input
              label="last name"
              type="text"
              placeholder="Doe"
              hasOptions={false}
              required={true}
            />
            <Input
              label="phone number"
              type="tel"
              placeholder="+17778881111"
              hasOptions={false}
              required={true}
              helpText="The phone number you enter must match the format shown in the placeholder! e.g. +17778881111"
            />
            <Input
              label="email"
              type="email"
              placeholder="JohnDoe@doey.com"
              hasOptions={false}
              required={true}
            />
          </Stack>
        </Box>
      </form>
    </main>
  );
}

export default withAuthenticationRequired(Create);
