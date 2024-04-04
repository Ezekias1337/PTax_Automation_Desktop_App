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
      error.message === "unknown error: Failed to create Chrome process.." ||
      error.message.includes("Chrome failed to start")
    ) {
      await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
        primaryMessage:
          "Either Google Chrome is not installed or it is corrupt. Please uninstall Google Chrome and reinstall it. Contact the developer for assistance if the issue persists after closing and restarting the app.",
        messageColor: "red",
        errorMessage: null,
      });
    } else {
      await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
        primaryMessage: `Unknown error occurred while logging in, please try again. ${error.mesage}`,
        messageColor: "red",
        errorMessage: null,
      });
    }
  }
};

module.exports = paymentConfirmations;
