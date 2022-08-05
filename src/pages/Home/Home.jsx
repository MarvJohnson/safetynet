import React from "react";
import "./styling.css";
import { Heading } from "@twilio-paste/core/heading";
import { Paragraph } from "@twilio-paste/core/paragraph";
import { OrderedList, UnorderedList, ListItem } from "@twilio-paste/core/list";
import { Separator } from "@twilio-paste/core/separator";

export default function Home() {
  return (
    <div className="App">
      <main>
        <section>
          <Heading as="h1" variant="heading10">
            Welcome to Safetynet!
          </Heading>
          <Heading as="h2" variant="heading20">
            an emergency, virtual safety deposit box solution
          </Heading>
        </section>
        <section>
          <Paragraph>
            <span className="p-header">Safetynet</span> provides an interface
            for establishing hyperlinked containers (otherwise known as Safety
            Deposit Boxes or SDBs) that enable users to access <i>PII</i>{" "}
            (Personally Identifiable Information) that the creator has
            configured.
          </Paragraph>
        </section>
        <section>
          <Heading as="h3" variant="heading30">
            How does it work?
          </Heading>
          <Separator orientation="horizontal" verticalSpacing="space50" />
          <Paragraph>The process is simple!</Paragraph>
          <OrderedList>
            <ListItem>You add contingents to your account</ListItem>
            <ListItem>
              You make a new Safety Deposit Box and attach one or more of the
              contingents you made
            </ListItem>
            <ListItem>
              You send the link to anyone you'd like to make the container
              accessible to
            </ListItem>
          </OrderedList>
          <Paragraph>
            Now, whenever a user attempts to follow the link and see the SDB's
            contents, an approval request is sent via SMS to anyone assigned as
            a contingent to the container. Once permission has been granted by
            an assigned contingent, the SDB's information will become visible to
            the requestee.
          </Paragraph>
        </section>
        <section>
          <Heading as="h3" variant="heading30">
            Is this secure?
          </Heading>
          <Separator orientation="horizontal" verticalSpacing="space50" />
          <Paragraph>
            Yes! All of your data encrypted and only made available following
            the processes outline above.
          </Paragraph>
        </section>
        <section>
          <Heading as="h3" variant="heading30">
            Twilio
          </Heading>
          <Separator orientation="horizontal" verticalSpacing="space50" />
          <Paragraph>
            Safetynet relies on several of{" "}
            <a href="https://www.twilio.com/" target="_blank">
              Twilio's APIs
            </a>{" "}
            to reliably service users no matter where they are in the world.
            Some of those APIs include:
          </Paragraph>
          <UnorderedList>
            <ListItem>
              <a href="https://www.twilio.com/messaging/sms" target="_blank">
                SMS
              </a>{" "}
              - for pushing text messages to contingents
            </ListItem>
            <ListItem>
              <a href="https://www.twilio.com/sync" target="_blank">
                Sync
              </a>{" "}
              - for updating user SDB requests in real-time
            </ListItem>
            <ListItem>
              <a
                href="https://www.twilio.com/docs/labs/serverless-toolkit"
                target="_blank"
              >
                Serverless Toolkit
              </a>{" "}
              - for hosting Safetynet and exposing it to the web
            </ListItem>
          </UnorderedList>
        </section>
        <section>
          <Heading as="h3" variant="heading30">
            Why?
          </Heading>
          <Separator orientation="horizontal" verticalSpacing="space50" />
          <Paragraph>
            This was an app built as part of a Twilio program during the 2022
            summer internship.
          </Paragraph>
        </section>
      </main>
    </div>
  );
}
