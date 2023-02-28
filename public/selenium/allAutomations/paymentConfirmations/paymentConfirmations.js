// Library Imports
const colors = require("colors");
// Functions, Helpers, Utils
const buildDriver = require("../../functions/driver/buildDriver");

const paymentConfirmations = async (sublocation) => {
  /* 
        Need to pick automation by using sublocation
    */

  const driver = await buildDriver();
  console.log(`Running payment confirmations automation for: ${sublocation}`);
};

module.exports = paymentConfirmations;
