// Library Imports
const { until, By } = require("selenium-webdriver");
const colors = require("colors");
// Functions, Helpers, Utils
const deleteInputFieldContents = require("../../../../../functions/general/deleteInputFieldContents");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../../../../functions/general/generateDynamicXPath");

const checkIfNoResultsOrMultipleResults = async (
  driver,
  item,
  assessmentWebsiteSelectors
) => {
  const checkURL = await driver.getCurrentUrl();

  if (checkURL.includes("search/CommonSearch.aspx?mode=PERSPROP")) {
    try {
      await driver.sleep(1000);
      const noResultsFoundElement = await driver.findElement(
        By.xpath(assessmentWebsiteSelectors.noParcelResultsFoundWarner)
      );

      const blockInputToDelete = await awaitElementLocatedAndReturn(
        driver,
        assessmentWebsiteSelectors.blockInputField,
        "id"
      );
      await deleteInputFieldContents(blockInputToDelete);

      const lotInputToDelete = await awaitElementLocatedAndReturn(
        driver,
        assessmentWebsiteSelectors.lotInputField,
        "id"
      );
      await deleteInputFieldContents(lotInputToDelete);

      console.log(
        colors.red.bold(`Parcel: ${item.ParcelNumber} not found in database`)
      );

      return true;
    } catch (error) {
      await driver.sleep(2000);
      const strSplit = item.ParcelNumber.split("-");

      const strToFindTD = strSplit[1];
      const noParcelResultsXPath = generateDynamicXPath(
        "div",
        strToFindTD,
        "contains"
      );
      const tdToClickBringToInformation = await awaitElementLocatedAndReturn(
        driver,
        noParcelResultsXPath,
        "xpath"
      );

      await tdToClickBringToInformation.click();
      await driver.wait(until.urlContains("/care/Datalets/Datalet.aspx"));
      console.log(
        `Parcel: ${item.ParcelNumber} has multiple results in database \n`
      );
      return false;
    }
  }
};

module.exports = checkIfNoResultsOrMultipleResults;
