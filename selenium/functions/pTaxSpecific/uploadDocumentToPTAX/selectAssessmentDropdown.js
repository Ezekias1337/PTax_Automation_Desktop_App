const { By } = require("selenium-webdriver");
const {
  uploadDocument,
} = require("../../../ptaxXpathsAndSelectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../general/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../general/generateDynamicXPath");

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
