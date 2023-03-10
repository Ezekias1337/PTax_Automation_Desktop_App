const { By } = require("selenium-webdriver");
const { uploadDocument } = require("../../../constants/selectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../../utils/waits/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../../utils/strings/generateDynamicXPath");

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
