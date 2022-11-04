const { until, By } = require("selenium-webdriver");
const awaitElementLocatedAndReturn = require("../../../functions/general/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../../functions/general/generateDynamicXPath");
const scrollElementIntoView = require("../../../functions/general/scrollElementIntoView");

const addAssessment = async (
  driver,
  assessmentNoticesSelectors,
  assessmentYear,
  landMarketValueString,
  landAssessedValueString = null,
  improvementMarketValueString,
  improvementAssessedValueString = null
) => {
  // Do data entry

  const btnNewAssessment = await awaitElementLocatedAndReturn(
    driver,
    assessmentNoticesSelectors.btnNewAssessment,
    "id"
  );
  await btnNewAssessment.click();

  /* NEED TO ADD HANDLING TO SELECT PROPER TAX YEAR IN 2021*/

  const taxYearNewAssessmentDropdown = await awaitElementLocatedAndReturn(
    driver,
    assessmentNoticesSelectors.taxYearNewAssessmentDropdown,
    "id"
  );
  const taxYearNewAssessmentXPath = generateDynamicXPath(
    "option",
    assessmentYear,
    "equals"
  );
  const taxYearForDropdown = await taxYearNewAssessmentDropdown.findElement(
    By.xpath(taxYearNewAssessmentXPath)
  );
  await taxYearForDropdown.click();

  const startAssessmentBtn = await awaitElementLocatedAndReturn(
    driver,
    assessmentNoticesSelectors.startAssessmentBtn,
    "id"
  );
  await startAssessmentBtn.click();
  await driver.wait(
    until.elementLocated(By.id(assessmentNoticesSelectors.assessmentSection))
  );

  const landMarketValueInputField = await awaitElementLocatedAndReturn(
    driver,
    assessmentNoticesSelectors.landMarketValueInput,
    "name"
  );
  await landMarketValueInputField.sendKeys(landMarketValueString);

  const landAssessedValueInputField = await awaitElementLocatedAndReturn(
    driver,
    assessmentNoticesSelectors.landAssessedValueInput,
    "name"
  );
  if (landAssessedValueString !== null) {
    await landAssessedValueInputField.sendKeys(landAssessedValueString);
  } else {
    await landAssessedValueInputField.sendKeys(landMarketValueString);
  }

  const improvementsMarketValueInputField = await awaitElementLocatedAndReturn(
    driver,
    assessmentNoticesSelectors.improvementsMarketValueInput,
    "name"
  );
  await improvementsMarketValueInputField.sendKeys(
    improvementMarketValueString
  );

  const improvementAssessedValueInputField = await awaitElementLocatedAndReturn(
    driver,
    assessmentNoticesSelectors.improvementsAssessedValueInput,
    "name"
  );

  if (improvementAssessedValueString !== null) {
    await improvementAssessedValueInputField.sendKeys(
      improvementAssessedValueString
    );
  } else {
    await improvementAssessedValueInputField.sendKeys(
      improvementMarketValueString
    );
  }

  const btnSaveAssessment = await awaitElementLocatedAndReturn(
    driver,
    assessmentNoticesSelectors.btnSaveAssessment,
    "name"
  );
  await scrollElementIntoView(driver, btnSaveAssessment);
  await btnSaveAssessment.click();
};

module.exports = addAssessment;
