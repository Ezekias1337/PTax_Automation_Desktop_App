// Functions, Helpers, and Utils
const sendMessageToFrontEnd = require("../ipc-bus/sendMessage/sendMessageToFrontEnd");

const closingAutomationSystem = async (driver, ipcBusClientNodeMain) => {
  if (driver && driver !== undefined) {
    await driver.quit();
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "Browser window closed",
      messageColor: "regular",
      errorMessage: null,
    });
  }
};

module.exports = closingAutomationSystem;
