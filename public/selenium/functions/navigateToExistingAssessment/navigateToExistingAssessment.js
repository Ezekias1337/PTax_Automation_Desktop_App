const { By } = require("selenium-webdriver");
const allSelectors = require("../../ptaxXpathsAndSelectors/allSelectors");
const awaitElementLocatedAndReturn = require("../general/awaitElementLocatedAndReturn");
const scrollElementIntoView = require("../general/scrollElementIntoView");

const navigateToExistingAssessment = async (driver) => {
  const taxBillDrivenTab = await awaitElementLocatedAndReturn(
    driver,
    allSelectors.taxBillDrivenTabSelector,
    "xpath"
  );
  await scrollElementIntoView(driver, taxBillDrivenTab)
  await taxBillDrivenTab.click();

  const currentYear = new Date().getFullYear().toString();
  const subcontainer21 = await driver.findElement(By.id("subcontainer21"));
  const arrayOftablesWithAssessments = await subcontainer21.findElements(
    By.css("table")
  );
  const tableWithAssessments = arrayOftablesWithAssessments[0];
  const arrayOfParcelRows = await tableWithAssessments.findElements(
    By.css(".parcelRow")
  );

  for (const item of arrayOfParcelRows) {
    const arrayOfParcelRowTDs = await item.findElements(By.css("td"));
    const assessmentCell = await arrayOfParcelRowTDs[1];
    const assessmentCellLink = await assessmentCell.findElement(By.css("a"));
    const assessmentCellLinkInnerText = await assessmentCellLink.getAttribute(
      "innerText"
    );

    if (assessmentCellLinkInnerText.includes(currentYear)) {
      await scrollElementIntoView(driver, assessmentCellLink);
      await assessmentCellLink.click();
      break;
    }
  }
};

module.exports = navigateToExistingAssessment;
