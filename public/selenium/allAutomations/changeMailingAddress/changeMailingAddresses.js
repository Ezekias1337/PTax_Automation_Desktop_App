// Library Imports
const colors = require("colors");
// Functions, Helpers, Utils
const buildDriver = require("../../functions/driver/buildDriver");
// Constants

// Selectors

const changeMailingAddresses = async (sublocation) => {
  /* 
        Need to pick automation by using sublocation
    */

  const driver = await buildDriver();
  console.log(`Running change mailing address automation for: ${sublocation}`);
};

module.exports = changeMailingAddresses;
