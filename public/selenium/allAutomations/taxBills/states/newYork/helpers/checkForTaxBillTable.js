const { until, By } = require("selenium-webdriver");

const checkForTaxBillTable = async (driver, taxWebsiteSelectors) => {
  let continueExecution = false;

  try {
    const taxBillTableElement = await driver.wait(
      until.elementLocated(By.id(taxWebsiteSelectors.taxBillTable)),
      10000
    );

    continueExecution = true;
  } catch (error) {}

  return continueExecution;
};

module.exports = checkForTaxBillTable;
