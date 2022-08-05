import React, { useState, useEffect } from "react";
import "./styling.css";
import Menu from "../../../Menu/Menu";
import Input from "../../../Input/Input";
import { Link, useNavigate } from "react-router-dom";
import safetyDepositBoxInputOptions from "../../../../data/SafetyDepositBoxInputOptions";
import { CloseCircleIcon } from "@twilio-paste/icons/cjs/CloseCircleIcon";
import { Heading } from "@twilio-paste/core/heading";
import { Button } from "@twilio-paste/core/button";
import { Stack } from "@twilio-paste/core/stack";
import { Box } from "@twilio-paste/core/box";
import { Text } from "@twilio-paste/core/text";
import camelCase from "lodash/camelCase";
import {
  createSafetyDepositBox,
  getUserContingents,
} from "../../../../services/userServices";
import { withAuthenticationRequired, useAuth0 } from "@auth0/auth0-react";
import Modal from "../../../Modal/Modal";

function Create() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contingents, setContingents] = useState([]);
  const [selectedContingents, setSelectedContingents] = useState([]);
  const [alertModalIsOpen, setAlertModalIsOpen] = useState(false);
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  async function initialize() {
    const accessToken = await getAccessTokenSilently({
      audience: "https://safetynet-6147-dev.twil.io/",
      scope: "read:user",
    });

    const contingents = await getUserContingents(accessToken);
    setContingents(contingents);

    if (contingents.length === 0) setAlertModalIsOpen(true);
  }

  useEffect(() => {
    initialize();
  }, [getAccessTokenSilently]);

  function addInput(field) {
    if (fields.some((existingField) => existingField.label === field.label))
      return;

    const updatedFields = [...fields, field];
    updatedFields.sort((a, b) => a.placementOrder - b.placementOrder);
    setFields(updatedFields);
  }

  function deleteInput(fieldLabel) {
    const updatedFields = [...fields].filter(
      (existingField) => existingField.label !== fieldLabel
    );
    setFields(updatedFields);
  }

  function getMenuItems() {
    return safetyDepositBoxInputOptions
      .filter((option) => option.optional === true)
      .map((option) => ({
        ...option,
        onClick() {
          addInput(option);
        },
      }));
  }

  function addSelectedContingent(contingent) {
    const newSelectedContingents = [...selectedContingents, contingent];

    setSelectedContingents(newSelectedContingents);
  }

  function removeSelectedContingent(contingent) {
    const newSelectedContingents = [...selectedContingents].filter(
      (selectedContingent) =>
        selectedContingent.phoneNumber !== contingent.phoneNumber
    );

    setSelectedContingents(newSelectedContingents);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (selectedContingents.length === 0) {
      console.log("Need at least one contingent");
      setLoading(false);

      return;
    }

    if (fields.length === 0) {
      console.log("Need at least one field");
      setLoading(false);

      return;
    }

    const inputNames = safetyDepositBoxInputOptions.map(
      (option) => option.label
    );

    const inputs = Array.from(e.target.elements)
      .filter((element) => inputNames.includes(element.name.replace("-", " ")))
      .map((input) => ({
        [camelCase(input.name).replace("-", "")]: input.value,
      }));

    const newSafetyDepositBox = inputs.reduce(
      (box, nextInput) => ({
        ...box,
        ...nextInput,
      }),
      {}
    );

    newSafetyDepositBox.contingents = selectedContingents;

    const accessToken = await getAccessTokenSilently({
      audience: "https://safetynet-6147-dev.twil.io/",
      scope: "read:user",
    });

    const response = await createSafetyDepositBox(
      accessToken,
      newSafetyDepositBox
    );

    if (response.status === 200 || response.status === 201) navigate("../");

    setLoading(false);
  }

  return (
    <main className="safety-deposit-box-create">
      <Modal
        title="Missing Contingent(s)"
        content="Safety Deposit Boxes require at least one contingent be assigned to them, but you don't have any contingents to assign! Head over to the contingents creation page, add a new contingent, and come back."
        isOpen={alertModalIsOpen}
        setIsOpen={setAlertModalIsOpen}
      />

      <Heading as="h1" variant="heading10">
        New Safety Deposit Box
      </Heading>

      <form
        className="safety-deposit-box-form"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <Stack orientation="horizontal" spacing="space60">
          <Box as="div" className="safety-deposit-box-area">
            <Stack orientation="horizontal" spacing="space30">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={
                  selectedContingents.length === 0 ||
                  fields.length === 0 ||
                  document.getElementById("box-name").value.length === 0
                }
              >
                Create Box
              </Button>
              <Menu menuText="Add a field" menuItems={getMenuItems()} />
              <Link to="../">
                <Button variant="destructive">
                  Cancel
                  <CloseCircleIcon title="Cancel Safety Deposit Box creation" />
                </Button>
              </Link>
              <Menu
                menuText="Add a contingent"
                menuItems={contingents
                  .filter(
                    (contingent) => !selectedContingents.includes(contingent)
                  )
                  .map((contingent) => ({
                    label: `${contingent.firstName} ${contingent.lastName} (${contingent.phoneNumber})`,
                    onClick() {
                      addSelectedContingent(contingent);
                    },
                  }))}
              />
            </Stack>

            <Box as="div" className="input-list">
              <Stack orientation="vertical" spacing="space40">
                <Input
                  label="box name"
                  type="text"
                  hasOptions={false}
                  required={true}
                />
                {fields.map((field) => (
                  <Input
                    key={field.label}
                    label={field.label}
                    type={field.type}
                    placeholder={field.placeholder}
                    deleteInput={deleteInput}
                  />
                ))}
              </Stack>
            </Box>
          </Box>

          <Box as="div" className="contingents-area">
            <Heading as="h2" variant="heading20">
              Contingents
            </Heading>
            <Stack orientation="vertical" spacing="space30">
              {selectedContingents.length > 0 ? (
                selectedContingents.map((contingent) => (
                  <Input
                    key={contingent.phoneNumber}
                    type="text"
                    placeholder={`${contingent.firstName} ${contingent.lastName} (${contingent.phoneNumber})`}
                    disabled={true}
                    deleteInput={() => {
                      removeSelectedContingent(contingent);
                    }}
                  />
                ))
              ) : (
                <Text as="p">No selected contingents!</Text>
              )}
            </Stack>
          </Box>
        </Stack>
      </form>
    </main>
  );
}

export default withAuthenticationRequired(Create);
