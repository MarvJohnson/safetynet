import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./styling.css";
import { getLinkedSafetyDepositBox } from "../../services/userServices";
import { SyncClient } from "twilio-sync";
import { getAccessToken } from "../../services/userServices";
import { Box } from "@twilio-paste/core/box";
import { Stack } from "@twilio-paste/core/stack";
import Input from "../Input/Input";
import { Heading } from "@twilio-paste/core/heading";

import Modal from "../Modal/Modal";

export default function LinkedSafetyDepositBox() {
  const [syncModalIsOpen, setSyncModalIsOpen] = useState(true);
  const [safetyDepositBox, setSafetyDepositBox] = useState(null);
  const { linkUUID } = useParams();

  async function setupSync() {
    const { syncDocumentUUID } = await getLinkedSafetyDepositBox(linkUUID);
    const accessToken = await getAccessToken("user1234");
    const syncClient = new SyncClient(accessToken);

    const syncDocument = await syncClient.document(syncDocumentUUID);
    syncDocument.on("updated", (event) => {
      if (event.data.approval === true) {
        setSafetyDepositBox(event.data.safetyDepositBox);
        setSyncModalIsOpen(false);
        syncClient.shutdown();
      }
    });
  }

  useEffect(() => {
    setupSync();
  }, []);

  return (
    <main className="linked-safety-deposit-box">
      <Modal
        title="Waiting for approval..."
        content="Before the contents of this Safety Deposit Box are revealed, one or more contingents must give their approval..."
        isOpen={syncModalIsOpen}
        setIsOpen={setSyncModalIsOpen}
        canClickOK={safetyDepositBox !== null}
      />
      {safetyDepositBox && (
        <Box as="div" className="safety-deposit-box-input-list">
          <Stack orientation="vertical" spacing="space40">
            {Object.getOwnPropertyNames(safetyDepositBox).map((propertyName) =>
              propertyName !== "contingents" ? (
                <Input
                  label={propertyName}
                  type="text"
                  placeholder={safetyDepositBox[propertyName]}
                  hasOptions={false}
                  disabled={true}
                />
              ) : (
                <Box>
                  <Heading as="h3" variant="heading30">
                    Contingents
                  </Heading>
                  <Stack orientation="vertical" spacing="space30">
                    {safetyDepositBox.contingents.map((contingent) => (
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
          </Stack>
        </Box>
      )}
    </main>
  );
}
