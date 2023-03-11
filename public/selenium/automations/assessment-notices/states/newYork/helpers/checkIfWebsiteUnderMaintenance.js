// Library Imports
const { By } = require("selenium-webdriver");
// Functions, Helpers, Utils
const closingAutomationSystem = require("../../../../../functions/driver/closingAutomationSystem");
// Selectors
const websiteSelectors = require("../../../../property-tax-bills/states/newYork/websiteSelectors");

const checkIfWebsiteUnderMaintenance = async (driver) => {
  try {
    await driver.findElement(
      By.xpath(websiteSelectors.websiteMaintenanceWarner)
    );
    console.log("Website is under maintenance, unable to proceed.");
    await closingAutomationSystem(driver);
    return true;
  } catch (error) {
    console.log("Website not under maintance. Continuing.");
    return false;
  }
};

module.exports = checkIfWebsiteUnderMaintenance;
