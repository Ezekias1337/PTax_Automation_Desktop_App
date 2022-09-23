const htmlPdf = require("html-pdf-chrome");
const { By } = require("selenium-webdriver");
const switchToAndDismissAlert = require("../tabSwapsAndHandling/switchToAndDismissAlert");

const attemptToPrint = async (
  driver,
  outputDirectory,
  fileNameForFile,
  cssSelector,
  dismissAlertOnRetry = false
) => {
  await driver.sleep(10000);
  if (dismissAlertOnRetry === true) {
    await switchToAndDismissAlert(driver);
  }
  const sourceHTML = await driver
    .findElement(By.css(cssSelector))
    .getAttribute("innerHTML");
  let pdf = await htmlPdf.create(sourceHTML);

  console.log("Saving as " + fileNameForFile + "...");
  await pdf.toFile(`${outputDirectory}/${fileNameForFile}.pdf`);
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

  try {
    await attemptToPrint(driver, outputDirectory, fileNameForFile, cssSelector);
    printedSuccessfully = true;
  } catch (error) {
    console.log("Failed to capture PDF, retrying: ");
    await driver.sleep(10000);
    await attemptToPrint(
      driver,
      outputDirectory,
      fileNameForFile,
      cssSelector,
      dismissAlertOnRetry
    );
    printedSuccessfully = true;
  }
  return printedSuccessfully;
};

module.exports = printPageToPDF;
