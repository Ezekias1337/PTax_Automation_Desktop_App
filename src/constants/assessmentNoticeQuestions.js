export const assessmentNoticeQuestions = [
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
    name: "Upload Directory",
    parentQuestions: null,
    inputType: "File",
  },
  {
    key: 4,
    name: "Download Directory",
    parentQuestions: null,
    inputType: "Directory",
  },
];
