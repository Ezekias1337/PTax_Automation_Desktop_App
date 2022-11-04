const { Key } = require("selenium-webdriver");
const {
  uploadDocument,
} = require("../../../ptaxXpathsAndSelectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../general/awaitElementLocatedAndReturn");
const deleteInputFieldContents = require("../../general/deleteInputFieldContents");

const enterYear = async (driver, year) => {
  const taxYearInput = await awaitElementLocatedAndReturn(
    driver,
    uploadDocument.taxYear,
    "id"
  );
  await deleteInputFieldContents(taxYearInput);
  await taxYearInput.sendKeys(year);
};

module.exports = enterYear;
