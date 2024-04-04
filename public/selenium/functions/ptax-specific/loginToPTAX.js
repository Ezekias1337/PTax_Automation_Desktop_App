// Library Imports
const { By, Key } = require("selenium-webdriver");
// Functions, Helpers, Utils
const buildDriver = require("../driver/buildDriver");
const closingAutomationSystem = require("../driver/closingAutomationSystem");
const swapToAndDismissAlert = require("../tab-swaps-and-handling/switchToAndDismissAlert");
const invalidLoginInfo = require("../general/invalidLoginInfo");
const sendMessageToFrontEnd = require("../ipc-bus/sendMessage/sendMessageToFrontEnd");
const swapToIFrame0 = require("./frame-swaps/swapToIFrame0");
const clickCheckMyPropertiesCheckBox = require("./clickCheckMyPropertiesCheckBox");
// Constants
const { ptaxLoginPage } = require("../../constants/urls");
// Selectors
const {
  userNameSelector,
  passWordSelector,
} = require("../../constants/selectors/allSelectors");

const loginToPtax = async (username, password, ipcBusClientNodeMain) => {
  try {
    const objToReturn = {
      driver: null,
      ptaxWindow: null,
    };

    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "Logging into Ptax",
      messageColor: "regular",
      errorMessage: null,
    });

    objToReturn.driver = await buildDriver(ipcBusClientNodeMain);
    objToReturn.ptaxWindow = await objToReturn.driver.getWindowHandle();

    await objToReturn.driver.get(ptaxLoginPage);
    const usernameInput = await objToReturn.driver.findElement(
      By.name(userNameSelector)
    );
    await usernameInput.sendKeys(username);
    const paswordInput = await objToReturn.driver.findElement(
      By.name(passWordSelector)
    );
    await paswordInput.sendKeys(password, Key.RETURN);

    try {
      const alertText = await swapToAndDismissAlert(objToReturn.driver);
      if (
        alertText === "Invalid Login.  Remember, passwords are CaseSensitive."
      ) {
        await invalidLoginInfo(objToReturn.driver, ipcBusClientNodeMain);
        await closingAutomationSystem(objToReturn.driver, ipcBusClientNodeMain);
      }
    } catch (error) {
      await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
        primaryMessage: "Login into Ptax Successful!",
        messageColor: "regular",
        errorMessage: null,
      });

      await swapToIFrame0(objToReturn.driver);
      await clickCheckMyPropertiesCheckBox(objToReturn.driver);
    }
    return objToReturn;
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

module.exports = loginToPtax;
