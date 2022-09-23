const awaitElementLocatedAndReturn = require("../../../../../../../functions/general/awaitElementLocatedAndReturn");
const scrollElementIntoView = require("../../../../../../../functions/general/scrollElementIntoView");
const fluentWait = require("../../../../../../../functions/general/fluentWait");
const { By } = require("selenium-webdriver");

const navigateToAssessmentData = async (driver, assessmentWebsiteSelectors) => {
  let navigationSuccessful;
  try {
    const viewPropertyButton = await awaitElementLocatedAndReturn(
      driver,
      assessmentWebsiteSelectors.viewProperty,
      "xpath"
    );
    await viewPropertyButton.click();

    const viewValueHistoryButton = await awaitElementLocatedAndReturn(
      driver,
      assessmentWebsiteSelectors.valueHistory,
      "xpath"
    );
    await viewValueHistoryButton.click();

    await fluentWait(
      driver,
      assessmentWebsiteSelectors.viewTotalRollValue,
      "xpath",
      15,
      2,
      "Failed to find total roll value button. Property has 0 value."
    );

    const totalRollValueElement = await driver.findElement(
      By.xpath(assessmentWebsiteSelectors.viewTotalRollValue)
    );
    await scrollElementIntoView(driver, totalRollValueElement);
    await totalRollValueElement.click();

    navigationSuccessful = true;
  } catch (error) {
    navigationSuccessful = false;
  }

  return navigationSuccessful;
};

module.exports = navigateToAssessmentData;
