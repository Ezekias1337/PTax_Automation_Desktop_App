// Library Imports
const { By } = require("selenium-webdriver");
// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../utils/waits/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../../utils/strings/generateDynamicXPath");
// Selectors
const { uploadDocument } = require("../../../constants/selectors/allSelectors");

const selectAssessmentDropdown = async (driver, assessmentYearEnd) => {
  const selectAssessmentDropdownElement = await awaitElementLocatedAndReturn(
    driver,
    uploadDocument.assessment,
    "id"
  );
  const xPathForCorrectDropdownElement = generateDynamicXPath(
    "option",
    assessmentYearEnd,
    "contains"
  );

  const correctDropdownElement =
    await selectAssessmentDropdownElement.findElement(
      By.xpath(xPathForCorrectDropdownElement)
    );
  await correctDropdownElement.click();
};

module.exports = selectAssessmentDropdown;
