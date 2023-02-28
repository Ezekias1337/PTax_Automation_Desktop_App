// Library Imports
const { until, By } = require("selenium-webdriver");

const checkForNoticesOfPropertyValueTable = async (
  driver,
  assessmentWebsiteSelectors
) => {
  let continueExecution = false;

  try {
    const noticesOfPropertyValueTableElement = await driver.wait(
      until.elementLocated(
        By.id(assessmentWebsiteSelectors.noticesOfPropertyValueTable)
      ),
      10000
    );

    continueExecution = true;
  } catch (error) {
    console.log("THIS IS WHY IT FAILED: ", error);
  }

  return continueExecution;
};

module.exports = checkForNoticesOfPropertyValueTable;
