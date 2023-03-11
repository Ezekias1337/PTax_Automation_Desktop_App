const propertyTaxBills = require("../../../automations/property-tax-bills/propertyTaxBills");

const propertyTaxBillsData = {
  key: 8,
  name: "Property Tax Bills",
  locations: [
    {
      key: 1,
      state: "California",
      subLocations: [
        {
          key: 1,
          name: "Los Angeles",
          function: propertyTaxBills,
          availableOperations: [
            "Data Entry",
            "Download Document",
            "Data Entry, Download Document, & Upload Document",
          ],
        },
      ],
    },
    {
      key: 2,
      state: "New York",
      subLocations: [
        {
          key: 1,
          name: "New York City",
          function: propertyTaxBills,
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
      state: "Illinois",
      subLocations: [
        {
          key: 1,
          name: "Cook County",
          function: propertyTaxBills,
          availableOperations: [
            "Data Entry",
            "Download Document",
            "Data Entry, Download Document, & Upload Document",
          ],
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

module.exports = propertyTaxBillsData;