// Library Imports
const htmlPdf = require("html-pdf-chrome");
const { By } = require("selenium-webdriver");
// Functions, Helpers, Utils
const switchToAndDismissAlert = require("../tab-swaps-and-handling/switchToAndDismissAlert");

const {
  replaceForwardslashWithBackwardSlash,
} = require("../../../shared/utils/strings/replaceForwardslashWithBackwardSlash");

const attemptToPrint = async (
  driver,
  outputDirectory,
  fileNameForFile,
  cssSelector,
  dismissAlertOnRetry = false
) => {
  let outputDirectorySlashesInverted =
    replaceForwardslashWithBackwardSlash(outputDirectory);

  await driver.sleep(10000);
  if (dismissAlertOnRetry === true) {
    await switchToAndDismissAlert(driver);
  }
  const sourceHTML = await driver
    .findElement(By.css(cssSelector))
    .getAttribute("innerHTML");
  let pdf = await htmlPdf.create(sourceHTML);

  console.log("Saving as " + fileNameForFile + "...");
  let fullPathToSaveFile = outputDirectorySlashesInverted;
  fullPathToSaveFile += "\\";
  fullPathToSaveFile += `${fileNameForFile}.pdf`;

  await pdf.toFile(fullPathToSaveFile);
  console.log("File saved!");
  return true;
};

const printPageToPDF = async (
  driver,
  outputDirectory,
  fileNameForFile,
  cssSelector,
  dismissAlertOnRetry = false
) => {
  let printedSuccessfully = false;

  /* 
    The function will try to get the PDF twice before giving up
    and returning false
  */

  try {
    await attemptToPrint(driver, outputDirectory, fileNameForFile, cssSelector);
    printedSuccessfully = true;
  } catch (error) {
    console.log("Failed to capture PDF, retrying: ");
    try {
      await driver.sleep(5000);
      await attemptToPrint(
        driver,
        outputDirectory,
        fileNameForFile,
        cssSelector
      );
      printedSuccessfully = true;
    } catch (onceNestedError) {
      console.log("Failed to capture PDF second time, retrying: ");
      try {
        await driver.sleep(5000);
        await attemptToPrint(
          driver,
          outputDirectory,
          fileNameForFile,
          cssSelector,
          dismissAlertOnRetry
        );
        printedSuccessfully = true;
      } catch (twiceNestedError) {
        console.log("Failed to capture PDF second time. Check your selector.");
      }
    }
  }

  return printedSuccessfully;
};

module.exports = printPageToPDF;
