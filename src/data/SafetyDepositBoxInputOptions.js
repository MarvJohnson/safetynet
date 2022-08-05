const safetyDepositBoxInputOptions = [
  {
    type: "text",
    label: "box name",
    placeholder: "Unique Name",
    placementOrder: -1,
    optional: false,
  },
  {
    type: "text",
    label: "first name",
    placeholder: "John",
    placementOrder: 0,
    optional: true,
  },
  {
    type: "text",
    label: "last name",
    placeholder: "Doe",
    placementOrder: 1,
    optional: true,
  },
  {
    type: "email",
    label: "email",
    placeholder: "JohnDoe@doey.com",
    placementOrder: 2,
    optional: true,
  },
  {
    type: "tel",
    label: "phone number",
    placeholder: "+17778881111",
    placementOrder: 3,
    optional: true,
  },
];

export default safetyDepositBoxInputOptions;
