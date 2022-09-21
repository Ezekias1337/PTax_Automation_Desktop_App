export const listOfAutomations = {
  assessmentNotices: {
    key: 1,
    name: "Assessment Notices",
    state: [
      {
        key: 1,
        name: "Nevada",
        county: [
          {
            key: 1,
            name: "Clark County",
            /* function: assessmentNotices, */
            operation: [
              {
                key: 1,
                name: "Data Entry",
              },
              {
                key: 2,
                name: "Download Document",
              },
              {
                key: 3,
                name: "Data Entry, Download, & Upload Document",
              },
            ],
          },
        ],
      },
      {
        key: 2,
        name: "New York",
        county: [
          {
            key: 1,
            name: "New York",
            /* function: assessmentNotices, */
            operation: [
              {
                key: 1,
                name: "Data Entry",
              },
              {
                key: 2,
                name: "Download Document",
              },
              {
                key: 3,
                name: "Data Entry, Download, & Upload Document",
              },
            ],
          },
        ],
      },
      {
        key: 3,
        name: "California",
        county: [
          {
            key: 1,
            name: "Kern",
            /* function: assessmentNotices, */
            operation: [
              {
                key: 1,
                name: "Data Entry",
              },
              {
                key: 2,
                name: "Download Document",
              },
              {
                key: 3,
                name: "Data Entry, Download, & Upload Document",
              },
            ],
          },
          {
            key: 2,
            name: "Los Angeles",
            /* function: assessmentNotices, */
            operation: [
              {
                key: 1,
                name: "Data Entry",
              },
              {
                key: 2,
                name: "Download Document",
              },
              {
                key: 3,
                name: "Data Entry, Download, & Upload Document",
              },
            ],
          },
          {
            key: 3,
            name: "Riverside",
            /* function: assessmentNotices, */
            operation: [
              {
                key: 1,
                name: "Data Entry",
              },
              {
                key: 2,
                name: "Download Document",
              },
              {
                key: 3,
                name: "Data Entry, Download, & Upload Document",
              },
            ],
          },
          {
            key: 4,
            name: "San Bernardino",
            /* function: assessmentNotices, */
            operation: [
              {
                key: 1,
                name: "Data Entry",
              },
              {
                key: 2,
                name: "Download Document",
              },
              {
                key: 3,
                name: "Data Entry, Download, & Upload Document",
              },
            ],
          },
          {
            key: 5,
            name: "San Diego",
            /* function: assessmentNotices, */
            operation: [
              {
                key: 1,
                name: "Download Document",
              },
            ],
          },
        ],
      },
    ],
  },
  changeMailingAddress: {
    key: 2,
    name: "Change Mailing Address",
    WIP: true,
    /* state: [{ key: 1, name: "", county: [] }], */
  },
  checkRequests: {
    key: 3,
    name: "Check Requests",
    WIP: true,
  },
  paymentConfirmations: {
    key: 4,
    name: "Payment Confirmations",
    state: [
      {
        key: 1,
        name: "California",
        county: [
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
        name: "Pennsylvania",
        county: [
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
    state: [
      {
        key: 1,
        name: "California",
        county: [
          {
            key: 1,
            name: "Los Angeles",
            /* function: taxBills, */
            operation: [
              {
                key: 1,
                name: "Data Entry",
              },
              {
                key: 2,
                name: "Download Document",
              },
              {
                key: 3,
                name: "Data Entry, Download, & Upload Document",
              },
            ],
          },
        ],
      },
      {
        key: 2,
        name: "New York",
        county: [
          {
            key: 1,
            name: "New York",
            /* function: taxBills, */
            operation: [
              {
                key: 1,
                name: "Data Entry",
              },
              {
                key: 2,
                name: "Download Document",
              },
              {
                key: 3,
                name: "Data Entry, Download, & Upload Document",
              },
            ],
          },
        ],
      },
      {
        key: 3,
        name: "Illinois",
        county: [
          {
            key: 1,
            name: "Cook County",
            /* function: taxBills, */
            operation: [
              {
                key: 1,
                name: "Data Entry",
              },
              {
                key: 2,
                name: "Download Document",
              },
              {
                key: 3,
                name: "Data Entry, Download, & Upload Document",
              },
            ],
          },
        ],
      },
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
    /* function: updateParcelNames, */
  },
  checkWebsiteURLs: {
    key: 9,
    name: "Check all the links for Assessors/Collectors",
    /* function: checkWebsiteURLs, */
  },
  pullParcelInformationFromRealquest: {
    key: 10,
    name: "Pull parcel information from Realquest",
    WIP: true,
  },
};
const listOfAutomationsArray = [];

for (const item of Object.entries(listOfAutomations)) {
  listOfAutomationsArray.push(item[1]);
}

export const listOfAutomationsArrayExport = listOfAutomationsArray;
