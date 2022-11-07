export const taxBillQuestions = [
  {
    key: 0,
    name: "State",
    parentQuestions: null,
    inputType: "Dropdown",
  },
  {
    key: 1,
    name: "County",
    parentQuestions: ["state"],
    inputType: "Dropdown",
  },
  {
    key: 2,
    name: "Operation",
    parentQuestions: ["state", "county"],
    inputType: "Dropdown",
  },
  {
    key: 3,
    name: "Download Directory",
    parentQuestions: null,
    inputType: "Directory",
  },
  {
    key: 4,
    name: "Spreadsheet File",
    parentQuestions: null,
    inputType: "File",
  },
  {
    key: 4,
    name: "Assessment Year",
    parentQuestions: null,
    inputType: "Text",
  },
  {
    key: 5,
    name: "Ptax Username",
    parentQuestions: null,
    inputType: "Text",
  },
  {
    key: 6,
    name: "Ptax Password",
    parentQuestions: null,
    inputType: "Password",
  },
  {
    key: 7,
    name: "Parcel Quest Username",
    parentQuestions: null,
    inputType: "Text",
  },
  {
    key: 8,
    name: "Parcel Quest Password",
    parentQuestions: null,
    inputType: "Password",
  },
  {
    key: 9,
    name: "Installment Number",
    parentQuestions: null,
    inputType: "Text",
  },
];
