// Library Imports
const colors = require("colors");
const { By, until } = require("selenium-webdriver");
// Functions, Helpers, Utils
const buildDriver = require("../../functions/driver/buildDriver");
const closingAutomationSystem = require("../../functions/driver/closingAutomationSystem");
const swapToIFrameDefaultContent = require("../../functions/ptax-specific/frame-swaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../functions/ptax-specific/frame-swaps/swapToIFrame0");
const swapToIFrame1 = require("../../functions/ptax-specific/frame-swaps/swapToIFrame1");
const clickCheckMyPropertiesCheckBox = require("../../functions/ptax-specific/clickCheckMyPropertiesCheckBox");
const sendMessageToFrontEnd = require("../../functions/ipc-bus/sendMessage/sendMessageToFrontEnd");
const handleAutomationCancel = require("../../functions/ipc-bus/handleAutomationCancel");
const waitForLoading = require("../../functions/ptax-specific/waitForLoading");

const handleGlobalError = require("../../helpers/handleGlobalError");

const awaitElementLocatedAndReturn = require("../../utils/waits/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../utils/strings/generateDynamicXPath");
const sendKeysInputFields = require("../../utils/web-elements/sendKeysInputFields");
const scrollElementIntoView = require("../../utils/web-elements/scrollElementIntoView");

// Selectors
const {
  searchByParcelNumberSelector,
  assessmentNoticesSelectors,
} = require("../../constants/selectors/allSelectors");

const parcelQuestCharges = async (
  { ptaxUsername, ptaxPassword, spreadsheetContents, assessmentYear },
  ipcBusClientNodeMain
) => {
  try {
    const driver = await buildDriver(ipcBusClientNodeMain);

    for (const item of spreadsheetContents) {
      try {
      } catch (error) {}
    }

    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Automation Completed");
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "The automation is complete.",
      messageColor: "regular",
    });
    await closingAutomationSystem(driver, ipcBusClientNodeMain);
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

module.exports = parcelQuestCharges;
