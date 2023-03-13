// Functions, Helpers, Utils
const closingAutomationSystem = require("../driver/closingAutomationSystem");
const sendMessageToFrontEnd = require("../ipc-bus/sendMessage/sendMessageToFrontEnd");

const invalidLoginInfo = async (driver, ipcBusClientNodeMain) => {
  await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
    primaryMessage:
      "The login information you entered is not correct. Remember that it is case sensitive. Try again.",
    messageColor: "red",
    errorMessage: null,
  });

  await closingAutomationSystem(driver, ipcBusClientNodeMain);
  return;
};

module.exports = invalidLoginInfo;
