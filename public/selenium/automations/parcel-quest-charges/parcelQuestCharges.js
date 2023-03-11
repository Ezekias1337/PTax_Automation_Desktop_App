// Library Imports
const colors = require("colors");
const { By, until } = require("selenium-webdriver");
// Functions, Helpers, Utils
const loginToPTAX = require("../../functions/ptax-specific/loginToPTAX");
const closingAutomationSystem = require("../../functions/driver/closingAutomationSystem");
const swapToIFrameDefaultContent = require("../../functions/ptax-specific/frame-swaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../functions/ptax-specific/frame-swaps/swapToIFrame0");
const swapToIFrame1 = require("../../functions/ptax-specific/frame-swaps/swapToIFrame1");
const clickCheckMyPropertiesCheckBox = require("../../functions/ptax-specific/clickCheckMyPropertiesCheckBox");
const logErrorMessageCatch = require("../../functions/general/logErrorMessageCatch");
const sendMessageToFrontEnd = require("../../functions/ipc-bus/sendMessage/sendMessageToFrontEnd");
const handleAutomationCancel = require("../../functions/ipc-bus/handleAutomationCancel");

const awaitElementLocatedAndReturn = require("../../utils/waits/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../utils/strings/generateDynamicXPath");
const waitForLoading = require("../../functions/ptax-specific/waitForLoading");
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
    console.log(`Running add new parcel automation: `);

    const [ptaxWindow, driver] = await loginToPTAX(ptaxUsername, ptaxPassword);
    handleAutomationCancel(ipcBusClientNodeMain, driver);

    /* 
        These values will be null if the login failed, this will cause the execution
        to stop. If it fails before even loading ptax, it means
        that the chrome web driver is out of date. Otherwise,
        it means the login credentials are incorrect 
    */

    if (ptaxWindow === null || driver === null) {
      await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
        primaryMessage:
          "Login to PTax failed! Please check your username and password.",
        messageColor: "red",
      });
      return;
    }
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "Login to PTax Successful!",
      messageColor: "green",
    });

    await swapToIFrame0(driver);
    await clickCheckMyPropertiesCheckBox(driver);

    for (const item of spreadsheetContents) {
      try {
        
      } catch (error) {
        
      }
    }

    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Automation Completed");
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "The automation is complete.",
      messageColor: "blue",
    });
    await closingAutomationSystem(driver);
  } catch (error) {
    logErrorMessageCatch(error);
  }
};

module.exports = parcelQuestCharges;
