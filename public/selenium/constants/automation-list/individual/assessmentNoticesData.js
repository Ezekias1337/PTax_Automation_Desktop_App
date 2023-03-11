const assessmentNotices = require("../../../automations/assessment-notices/assessmentNotices");

const assessmentNoticesData = {
  key: 2,
  name: "Assessment Notices",
  locations: [
    {
      key: 1,
      state: "Nevada",
      subLocations: [
        { key: 1, name: "Clark County", function: assessmentNotices },
      ],
    },
    {
      key: 2,
      state: "New York",
      subLocations: [
        {
          key: 1,
          name: "New York County",
          function: assessmentNotices,
          availableOperations: [
            "Data Entry",
            "Download Document",
            "Data Entry, Download Document, & Upload Document",
          ],
        },
      ],
    },
    {
      key: 3,
      state: "California",
      subLocations: [
        {
          key: 1,
          name: "Kern",
          function: assessmentNotices,
          availableOperations: [
            "Data Entry",
            "Download Document",
            "Data Entry, Download Document, & Upload Document",
          ],
        },
        {
          key: 2,
          name: "Los Angeles",
          function: assessmentNotices,
          availableOperations: [
            "Data Entry",
            "Download Document",
            "Data Entry, Download Document, & Upload Document",
          ],
        },
        {
          key: 3,
          name: "Riverside",
          function: assessmentNotices,
          availableOperations: [
            "Data Entry",
            "Download Document",
            "Data Entry, Download Document, & Upload Document",
          ],
        },
        {
          key: 4,
          name: "San Bernardino",
          function: assessmentNotices,
          availableOperations: [
            "Data Entry",
            "Download Document",
            "Data Entry, Download Document, & Upload Document",
          ],
        },
        {
          key: 5,
          name: "San Diego",
          function: assessmentNotices,
          availableOperations: ["Download Document"],
        },
      ],
    },
  ],
  operations: [
    { key: 1, name: "Data Entry" },
    { key: 2, name: "Download Files" },
    { key: 3, name: "Data Entry And Download Files" },
  ],
};

module.exports = assessmentNoticesData;
