const { By } = require("selenium-webdriver");
const { uploadDocument } = require("../../../constants/selectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../../utils/waits/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../../utils/strings/generateDynamicXPath");

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
