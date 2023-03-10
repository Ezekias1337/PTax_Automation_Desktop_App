// Library Imports
const colors = require("colors");
const { until, By } = require("selenium-webdriver");
// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../../../utils/waits/awaitElementLocatedAndReturn");
const consoleLogLine = require("../../../../../functions/general/consoleLogLine");
const generateDynamicXPath = require("../../../../../utils/strings/generateDynamicXPath");
const saveLinkToFile = require("../../../../../functions/file-operations/saveLinkToFile");
const checkForNoticesOfPropertyValueTable = require("./checkForNoticesOfPropertyValueTable");

const downloadAssessment = async (
  driver,
  item,
  assessmentWebsiteSelectors,
  outputDirectory,
  assessmentYear,
  arrayOfFailedOperations
) => {
  const noticesOfPropertyValueTabelement = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.noticesOfPropertyValueTab,
    "xpath"
  );
  await noticesOfPropertyValueTabelement.click();

  await driver.wait(until.urlContains("=nopv"));
  /* 
      Before trying to download, need to check for the table element which contains the
      links to ensure the script doesn't get stuck
  */

  const continueExecution = await checkForNoticesOfPropertyValueTable(
    driver,
    assessmentWebsiteSelectors
  );

  if (continueExecution === false) {
    await driver.navigate().back();
    await driver.navigate().back();
    console.log(
      colors.red.bold(
        `Failed for parcel: ${item.ParcelNumber} Parcel found, but no tax bill in database`
      )
    );
    consoleLogLine();
    arrayOfFailedOperations.push(item);
    return;
  }

  /* 
      Because of the way the DOM is structured, it's necessary to parse out the correct
      anchor tag this way 
  */
  const downloadLinkChildXPath = generateDynamicXPath(
    "u",
    `${assessmentYear}`,
    "contains"
  );
  const downloadLinkChild = await driver.findElement(
    By.xpath(downloadLinkChildXPath)
  );
  const downloadLink = await downloadLinkChild.findElement(By.xpath("./../.."));

  const fileNameForFile = `${item.CompanyName} ${item.EntityName} ${item.ParcelNumber}`;

  const downloadSucceeded = await saveLinkToFile(
    downloadLink,
    outputDirectory,
    fileNameForFile,
    "pdf"
  );

  if (downloadSucceeded === true) {
    console.log(
      colors.yellow.bold(`Parcel: ${item.ParcelNumber} downloaded successfuly`)
    );
    return fileNameForFile;
  } else {
    console.log(
      colors.red.bold(`Parcel: ${item.ParcelNumber} failed to download`)
    );
    consoleLogLine();
    arrayOfFailedOperations.push(item);
    return null;
  }
};

module.exports = downloadAssessment;
