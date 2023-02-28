// Library Imports
const colors = require("colors");
const consoleLogLine = require("../../../../../../../functions/general/consoleLogLine");
// Functions, Helpers, Utils
const printPageToPDF = require("../../../../../../../functions/fileOperations/printPageToPDF");
const fluentWait = require("../../../../../../../functions/general/fluentWait");

const downloadAssessment = async (
  item,
  outputDirectory,
  driver,
  assessmentWebsiteSelectors
) => {
  const parcelLoadedSuccessfully = await fluentWait(
    driver,
    assessmentWebsiteSelectors.generalPropertyInfoTable,
    "xpath",
    15,
    3
  );
  if (parcelLoadedSuccessfully === false) {
    console.log(
      colors.red.bold(`Parcel: ${item.ParcelNumber} failed to download`)
    );
    consoleLogLine();
    return null;
  }

  const fileNameForFile = `${item.CompanyName} ${item.EntityName} ${item.ParcelNumber}`;
  const downloadSucceeded = await printPageToPDF(
    driver,
    outputDirectory,
    fileNameForFile,
    assessmentWebsiteSelectors.divForScreenshot,
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
