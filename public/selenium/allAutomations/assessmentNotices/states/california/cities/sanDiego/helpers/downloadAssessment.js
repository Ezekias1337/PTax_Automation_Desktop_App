// Library Imports
const colors = require("colors");
const { By, until } = require("selenium-webdriver");
// Functions, Helpers, Utils
const consoleLogLine = require("../../../../../../../functions/general/consoleLogLine");
const printPageToPDF = require("../../../../../../../functions/fileOperations/printPageToPDF");

const downloadAssessment = async (
  item,
  outputDirectory,
  driver,
  assessmentWebsiteSelectors
) => {
  const loader = await driver.findElement(
    By.xpath(assessmentWebsiteSelectors.loader)
  );
  await driver.wait(until.elementIsNotVisible(loader));

  const fileNameForFile = `${item.CompanyName} ${item.EntityName} ${item.ParcelNumber}`;
  const downloadSucceeded = await printPageToPDF(
    driver,
    outputDirectory,
    fileNameForFile,
    assessmentWebsiteSelectors.summary,
    true
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
    return null;
  }
};

module.exports = downloadAssessment;
