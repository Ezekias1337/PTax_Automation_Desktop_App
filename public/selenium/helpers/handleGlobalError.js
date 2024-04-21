// Functions, Helpers, and Utils
const sendMessageToFrontEnd = require("../functions/ipc-bus/sendMessage/sendMessageToFrontEnd");

const handleGlobalError = async (
  ipcBusClientNodeMain,
  messageType,
  errorMessage = null
) => {
  if (messageType === "Chrome Driver Needs Update") {
    await sendMessageToFrontEnd(
      ipcBusClientNodeMain,
      "Chrome Driver Needs Update",
      {
        primaryMessage: "Chrome Driver Needs Update",
      }
    );
  } else if (messageType === "Chrome Not Installed") {
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Chrome Not Installed", {
      primaryMessage: "Chrome Not Installed",
    });
  } else {
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Unknown Error", {
      errorMessage: errorMessage,
      primaryMessage: "Unknown Error",
    });
  }
};

module.exports = handleGlobalError;
