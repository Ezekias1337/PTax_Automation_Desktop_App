// Library Imports
const { By, Key } = require("selenium-webdriver");
// Functions, Helpers, Utils
const buildDriver = require("../driver/buildDriver");
const swapToAndDismissAlert = require("../tab-swaps-and-handling/switchToAndDismissAlert");
const invalidLoginInfo = require("../general/invalidLoginInfo");
// Constants
const { ptaxLoginPage } = require("../../constants/urls");
// Selectors
const {
  userNameSelector,
  passWordSelector,
} = require("../../constants/selectors/allSelectors");

const loginToPTAX = async (username, password) => {
  try {
    let driver = await buildDriver();
    let ptaxWindow = await driver.getWindowHandle();
    await driver.get(ptaxLoginPage);
    const usernameInput = await driver.findElement(By.name(userNameSelector));
    await usernameInput.sendKeys(username);
    const paswordInput = await driver.findElement(By.name(passWordSelector));
    await paswordInput.sendKeys(password, Key.RETURN);

    try {
      const alertText = await swapToAndDismissAlert(driver);
      if (
        alertText === "Invalid Login.  Remember, passwords are CaseSensitive."
      ) {
        await invalidLoginInfo(driver);

        /* This is here to check if the login fails in the automation. Then
        the value of ptaxWindow and driver will be checked to ensure it is 
        not null before proceeding with execution*/

        ptaxWindow = null;
        driver = null;
      }
    } catch (error) {
      console.log("Login successful");
    }
    return [ptaxWindow, driver];
  } catch (error) {
    console.log("Unknown error occurred while logging in, please try again.");
  }
};

module.exports = loginToPTAX;
