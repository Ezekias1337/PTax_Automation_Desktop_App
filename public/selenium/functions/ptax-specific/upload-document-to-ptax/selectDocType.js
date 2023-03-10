// Library Imports
const { By } = require("selenium-webdriver");
// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../utils/waits/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../../utils/strings/generateDynamicXPath");
// Selectors
const { uploadDocument } = require("../../../constants/selectors/allSelectors");

const selectDocType = async (driver, docType) => {
  const docTypeElement = await awaitElementLocatedAndReturn(
    driver,
    uploadDocument.docType,
    "id"
  );

  const xPathForCorrectDropdownElement = generateDynamicXPath(
    "option",
    docType,
    "equals"
  );

  const correctDropdownElement = await docTypeElement.findElement(
    By.xpath(xPathForCorrectDropdownElement)
  );
  await correctDropdownElement.click();
};

module.exports = selectDocType;
