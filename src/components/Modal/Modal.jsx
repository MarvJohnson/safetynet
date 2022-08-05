import { useUID } from "@twilio-paste/core/uid-library";
import { Button } from "@twilio-paste/core/button";
import {
  Modal as ModalComponent,
  ModalHeader,
  ModalHeading,
  ModalBody,
  ModalFooter,
  ModalFooterActions,
} from "@twilio-paste/core/modal";
import { Paragraph } from "@twilio-paste/core/paragraph";
import { Stack } from "@twilio-paste/core/stack";
import "./styling.css";

export default function Modal({
  title = "default",
  content = "default content...",
  isOpen = false,
  setIsOpen = () => {
    console.log("No 'setIsOpen' function assigned!");
  },
  canClickOK = true,
  options,
}) {
  const handleClose = () => setIsOpen(false);
  options ??= () => (
    <Button variant="primary" onClick={handleClose} disabled={!canClickOK}>
      Ok
    </Button>
  );
  const modalHeadingID = useUID();

  return (
    <div>
      <ModalComponent
        ariaLabelledby={modalHeadingID}
        isOpen={isOpen}
        onDismiss={handleClose}
        size="default"
      >
        <ModalHeader>
          <ModalHeading as="h3" id={modalHeadingID}>
            {title}
          </ModalHeading>
        </ModalHeader>
        <ModalBody>
          <Paragraph>{content}</Paragraph>
        </ModalBody>
        <ModalFooter>
          <ModalFooterActions>{options && options()}</ModalFooterActions>
        </ModalFooter>
      </ModalComponent>
    </div>
  );
}
