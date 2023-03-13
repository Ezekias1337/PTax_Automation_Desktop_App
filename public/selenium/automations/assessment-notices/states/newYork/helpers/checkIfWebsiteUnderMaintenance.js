// Library Imports
const { By } = require("selenium-webdriver");
// Functions, Helpers, Utils
const closingAutomationSystem = require("../../../../../functions/driver/closingAutomationSystem");
const sendMessageToFrontEnd = require("../../../../../functions/ipc-bus/sendMessage/sendMessageToFrontEnd");
// Selectors
const websiteSelectors = require("../../../../property-tax-bills/states/newYork/websiteSelectors");

const checkIfWebsiteUnderMaintenance = async (driver, ipcBusClientNodeMain) => {
  try {
    await driver.findElement(
      By.xpath(websiteSelectors.websiteMaintenanceWarner)
    );
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "Website is under maintenance, unable to proceed.",
      messageColor: "red",
    });
    await closingAutomationSystem(driver, ipcBusClientNodeMain);
    return true;
  } catch (error) {
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "Website not under maintance. Continuing...",
      messageColor: "regular",
    });
    return false;
  }
};

module.exports = checkIfWebsiteUnderMaintenance;
