const fluentWait = require("../../../../../../../functions/general/fluentWait");
const { By } = require("selenium-webdriver");

const ensureSearchReturnedResult = async (
  driver,
  assessmentWebsiteSelectors
) => {
  let searchSuccessful;

  try {
    await fluentWait(
      driver,
      assessmentWebsiteSelectors.searchFailedWarning,
      "xpath",
      6,
      2
    );
    const alertElement = await driver.findElement(
      By.xpath(assessmentWebsiteSelectors.searchFailedWarning)
    );
    searchSuccessful = false;
  } catch (error) {
    searchSuccessful = true;
  }
  return searchSuccessful;
};

module.exports = ensureSearchReturnedResult;
