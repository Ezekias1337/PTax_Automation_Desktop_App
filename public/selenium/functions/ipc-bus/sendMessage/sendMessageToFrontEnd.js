// Functions, Helpers, Utils
const sendAutomationCompleted = require("./individual/sendAutomationCompleted");
const sendCurrentIterationInfo = require("./individual/sendCurrentIterationInfo");
const sendEventLogInfo = require("./individual/sendEventLogInfo");
const sendFailedIteration = require("./individual/sendFailedIteration");
const sendSuccessfulIteration = require("./individual/sendSuccessfulIteration");

const sendChromeDriverNeedsUpdate = require("./individual/sendChromeDriverNeedsUpdate");
const sendChromeNotInstalled = require("./individual/sendChromeNotInstalled");

const sendUnknownError = require("./individual/sendUnknownError");

const sendMessageToFrontEnd = async (
  ipcBusClientNodeMain,
  messageType,
  { primaryMessage = null, messageColor = null, errorMessage = null }
) => {
  switch (messageType) {
    case "Automation Completed":
      await sendAutomationCompleted(ipcBusClientNodeMain);
      break;
    case "Current Iteration":
      await sendCurrentIterationInfo(ipcBusClientNodeMain, primaryMessage);
      break;
    case "Event Log":
      const eventLogObj = {
        color: messageColor,
        message: primaryMessage,
      };
      await sendEventLogInfo(ipcBusClientNodeMain, eventLogObj);
      break;
    case "Failed Iteration":
      await sendFailedIteration(
        ipcBusClientNodeMain,
        primaryMessage,
        errorMessage
      );
      break;
    case "Successful Iteration":
      await sendSuccessfulIteration(ipcBusClientNodeMain, primaryMessage);
      break;
    case "Chrome Driver Needs Update":
      await sendChromeDriverNeedsUpdate(ipcBusClientNodeMain);
      break;
    case "Chrome Not Installed":
      await sendChromeNotInstalled(ipcBusClientNodeMain);
      break;
    case "Unknown Error":
      await sendUnknownError(ipcBusClientNodeMain, errorMessage);
      break;
    default:
      console.log("No matching messageType found, check spelling.");
  }
};

module.exports = sendMessageToFrontEnd;
