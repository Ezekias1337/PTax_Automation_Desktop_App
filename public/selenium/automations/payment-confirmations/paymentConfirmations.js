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
    if (
      error.message ===
      "Cannot destructure property 'driver' of '(intermediate value)' as it is undefined."
    ) {
      await handleGlobalError(
        ipcBusClientNodeMain,
        "Chrome Driver Needs Update"
      );
    } else if (
      error.message.includes("Failed to create Chrome process") || error.message.includes("Chrome failed to start")
    ) {
      await handleGlobalError(ipcBusClientNodeMain, "Chrome Not Installed");
    } else {
      await handleGlobalError(
        ipcBusClientNodeMain,
        "Unknown Error",
        error.message
      );
    }
  }
};

module.exports = paymentConfirmations;
