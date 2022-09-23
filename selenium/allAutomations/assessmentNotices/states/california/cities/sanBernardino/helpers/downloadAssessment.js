const colors = require("colors");
const consoleLogLine = require("../../../../../../../functions/general/consoleLogLine");
const printPageToPDF = require("../../../../../../../functions/fileOperations/printPageToPDF");

const downloadAssessment = async (
  item,
  outputDirectory,
  driver,
  assessmentWebsiteSelectors
) => {
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
