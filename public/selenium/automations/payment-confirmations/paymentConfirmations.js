// Library Imports
const colors = require("colors");
// Functions, Helpers, Utils
const buildDriver = require("../../functions/driver/buildDriver");

const handleGlobalError = require("../../helpers/handleGlobalError");

const paymentConfirmations = async (sublocation) => {
  /* 
        Need to pick automation by using sublocation
    */

  try {
    const driver = await buildDriver(ipcBusClientNodeMain);
    console.log(`Running payment confirmations automation for: ${sublocation}`);

    for (const x of placeholder) {
      try {
      } catch (error) {}
    }
  } catch (error) {
    await handleGlobalError(ipcBusClientNodeMain, error.message);
  }
};

module.exports = paymentConfirmations;
