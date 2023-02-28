// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../../../../../functions/general/awaitElementLocatedAndReturn");

const scrollElementIntoView = require("../../../../../../../functions/general/scrollElementIntoView");

const navigateToAssessmentData = async (driver, assessmentWebsiteSelectors) => {
  const viewReportElement = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.viewReport,
    "xpath"
  );
  const viewReportElementHref = await viewReportElement.getAttribute("href");
  await driver.get(viewReportElementHref);

  const valueHistoryBtn = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.valueHistory,
    "xpath"
  );
  await scrollElementIntoView(driver, valueHistoryBtn);
  await valueHistoryBtn.click();
};

module.exports = navigateToAssessmentData;
