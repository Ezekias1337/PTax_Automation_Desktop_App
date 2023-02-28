// Library Imports
const colors = require("colors");
const { until, By } = require("selenium-webdriver");
// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../../../../functions/general/generateDynamicXPath");
const deleteInputFieldContents = require("../../../../../functions/general/deleteInputFieldContents");

const checkIfNoResultsOrMultipleResults = async (
  driver,
  item,
  taxWebsiteSelectors,
  arrayOfFailedOperations
) => {
  const checkURL = await driver.getCurrentUrl();

  if (checkURL.includes("search/CommonSearch.aspx?mode=PERSPROP")) {
    try {
      await driver.sleep(1000);
      const noResultsFoundElement = await driver.findElement(
        By.xpath(taxWebsiteSelectors.noParcelResultsFoundWarner)
      );

      arrayOfFailedOperations.push(item);

      const blockInputToDelete = await awaitElementLocatedAndReturn(
        driver,
        taxWebsiteSelectors.blockInputField,
        "id"
      );
      await deleteInputFieldContents(blockInputToDelete);

      const lotInputToDelete = await awaitElementLocatedAndReturn(
        driver,
        taxWebsiteSelectors.lotInputField,
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
