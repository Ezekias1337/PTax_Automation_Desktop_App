const listOfAutomations = {
  assessmentNotices: {
    key: 1,
    name: "Assessment Notices",
    locations: [
      {
        key: 1,
        state: "Nevada",
        subLocations: [
          /* { key: 1, name: "Clark County", function: assessmentNotices }, */
        ],
      },
      {
        key: 2,
        state: "New York",
        subLocations: [
          /* { key: 1, name: "New York", function: assessmentNotices }, */
        ],
      },
    ],
  },
  changeMailingAddress: {
    key: 2,
    name: "Change Mailing Address",
    WIP: true,
    /* locations: [{ key: 1, state: "", subLocations: [] }], */
  },
  checkRequests: {
    key: 3,
    name: "Check Requests",
    WIP: true,
  },
  paymentConfirmations: {
    key: 4,
    name: "Payment Confirmations",
    locations: [
      {
        key: 1,
        state: "California",
        subLocations: [
          { key: 1, name: "Los Angeles" /* function: paymentConfirmations */ },
          {
            key: 2,
            name: "Orange County" /* function: paymentConfirmations */,
          },
          {
            key: 3,
            name: "Riverside County" /* function: paymentConfirmations */,
          },
          {
            key: 4,
            name: "San Bernardino" /* function: paymentConfirmations */,
          },
          { key: 5, name: "San Diego" /* function: paymentConfirmations */ },
          {
            key: 4,
            name: "Ventura County" /* function: paymentConfirmations */,
          },
        ],
      },
      {
        key: 2,
        state: "Pennsylvania",
        subLocations: [
          {
            key: 1,
            name: "Multnomah County" /* function: paymentConfirmations */,
          },
        ],
      },
    ],
  },
  propertyPointOfContact: {
    key: 5,
    name: "Property Point of Contact",
    WIP: true,
  },
  taxBills: {
    key: 6,
    name: "Property Tax Bills",
    locations: [
      {
        key: 1,
        state: "California",
        subLocations: [
          {
            key: 1,
            name: "Los Angeles [No Data Entry]" /* function: taxBills */,
          },
        ],
      },
      {
        key: 2,
        state: "New York",
        subLocations: [{ key: 1, name: "New York" /* function: taxBills */ }],
      },
      {
        key: 3,
        state: "Illinois",
        subLocations: [
          { key: 1, name: "Cook County" /* function: taxBills */ },
        ],
      },
    ],
    operations: [
      { key: 1, name: "Data Entry" },
      { key: 2, name: "Download Files" },
      { key: 3, name: "Data Entry And Download Files" },
    ],
  },
  addNewParcels: {
    key: 7,
    name: "Add New Parcels",
    /* function: addNewParcels, */
  },
  updateParcelNames: {
    key: 8,
    name: "Update Parcel Names",
    WIP: true,
  },
  checkWebsiteURLs: {
    key: 9,
    name: "Check Assessor and Collector Links",
    /* function: checkWebsiteURLs, */
  },
  pullParcelInformationFromRealquest: {
    key: 10,
    name: "Pull Parcel Information From Realquest",
    WIP: true,
  },
};

const listOfAutomationsArray = [];

for (const item of Object.entries(listOfAutomations)) {
  listOfAutomationsArray.push(item[1]);
}

export const listOfAutomationsArrayExport = listOfAutomationsArray;
