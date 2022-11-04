//  Main Imports

const colors = require("colors");
const { until, By } = require("selenium-webdriver");
const buildDriver = require("../../../../../functions/driver/buildDriver");
const verifySpreadSheetColumnNames = require("../../../../../functions/fileOperations/verifySpreadSheetColumnNames");
const handleColumnNameLogging = require("../../../../../functions/fileOperations/handleColumnNameLogging");
const readSpreadsheetFile = require("../../../../../functions/fileOperations/readSpreadsheetFile");
const logErrorMessageCatch = require("../../../../../functions/general/consoleLogErrors/logErrorMessageCatch");
const printAutomationReportToSheet = require("../../../../../functions/fileOperations/printAutomationReportToSheet");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");
const closingAutomationSystem = require("../../../../../functions/general/closingAutomationSystem");
const generateDynamicXPath = require("../../../../../functions/general/generateDynamicXPath");
const deleteInputFieldContents = require("../../../../../functions/general/deleteInputFieldContents");
const promptForInstallment = require("../../../../../functions/userPrompts/individual/promptForInstallment");
const promptOutputDirectory = require("../../../../../functions/userPrompts/individual/promptOutputDirectory");
const saveLinkToFile = require("../../../../../functions/fileOperations/saveLinkToFile");
const generateDelayNumber = require("../../../../../functions/general/generateDelayNumber");
const trimLeadingZeros = require("../../../../../functions/general/trimLeadingZeros");
const { nyTaxBillSite } = require("../../../../../constants/urls");
const {
  downloadTaxBillsColumns,
} = require("../../../../../dataValidation/spreadsheetColumns/allSpreadSheetColumns");
const consoleLogLine = require("../../../../../functions/general/consoleLogLine");

// Helpers
const checkForTaxBillTable = require("../helpers/checkForTaxBillTable");
const checkIfNoResultsOrMultipleResults = require("../helpers/checkIfNoResultsOrMultipleResults");
const checkIfSessionExpired = require("../helpers/checkIfSessionExpired");
const checkIfWebsiteUnderMaintenance = require("../helpers/checkIfWebsiteUnderMaintenance");
const bblSearch = require("../helpers/bblSearch");

const performDownload = async (
  state,
  sublocation,
  operation,
  taxWebsiteSelectors
) => {
  /* 
      Goes to the NY Tax Bill website, downloads the bills from the Property Tax Bills 
      tab and places them in the specified output folder
    */

  const arrayOfSuccessfulOperations = [];
  const arrayOfFailedOperations = [];

  try {
    console.log(`Running Tax Bill Download Automation: `);

    const dataFromSpreadsheet = await readSpreadsheetFile();
    const outputDirectory = await promptOutputDirectory();
    const installmentNumber = await promptForInstallment();
    const [areCorrectSheetColumnsPresent, arrayOfMissingColumnNames] =
      verifySpreadSheetColumnNames(
        downloadTaxBillsColumns,
        dataFromSpreadsheet[0]
      );

    await handleColumnNameLogging(
      areCorrectSheetColumnsPresent,
      arrayOfMissingColumnNames
    );
    if (areCorrectSheetColumnsPresent === false) {
      return;
    }

    const driver = await buildDriver();
    await driver.get(nyTaxBillSite);
    const maintenanceStatus = await checkIfWebsiteUnderMaintenance(
      driver,
      taxWebsiteSelectors
    );
    if (maintenanceStatus === true) {
      throw "Website Under Maintenance";
    }

    const agreeBtnElement = await awaitElementLocatedAndReturn(
      driver,
      taxWebsiteSelectors.agreeBtn,
      "id"
    );
    await agreeBtnElement.click();

    for (const item of dataFromSpreadsheet) {
      try {
        console.log(
          colors.magenta.bold(`Working on parcel: ${item.ParcelNumber}`)
        );

        /* 
            If the script has been executing for a long time, the session times out and
            redirects to the homepage. This checks if this occurred, and if it has,
            then it will click the BBL Search button to proceed execution
        */

        await checkIfSessionExpired(driver, taxWebsiteSelectors);

        /* 
            Some parcels have leading zeros in the block/lot numbers which cause them
            to not be pulled up on the database. This remedies that.
        */

        const boroughNumber = item.ParcelNumber.split("-")[0];
        const blockNumberPreZerotrim = item.ParcelNumber.split("-")[1];
        const blockNumber = trimLeadingZeros(blockNumberPreZerotrim);
        const lotNumberPreZerotrim = item.ParcelNumber.split("-")[2];
        const lotNumber = trimLeadingZeros(lotNumberPreZerotrim);

        if (boroughNumber === "1") {
          const burough1Element = await awaitElementLocatedAndReturn(
            driver,
            taxWebsiteSelectors.burough1,
            "xpath"
          );
          await burough1Element.click();
        } else if (boroughNumber === "2") {
          const burough2Element = await awaitElementLocatedAndReturn(
            driver,
            taxWebsiteSelectors.burough2,
            "xpath"
          );
          await burough2Element.click();
        } else if (boroughNumber === "3") {
          const burough3Element = await awaitElementLocatedAndReturn(
            driver,
            taxWebsiteSelectors.burough3,
            "xpath"
          );
          await burough3Element.click();
        } else if (boroughNumber === "4") {
          const burough4Element = await awaitElementLocatedAndReturn(
            driver,
            taxWebsiteSelectors.burough4,
            "xpath"
          );
          await burough4Element.click();
        } else if (boroughNumber === "5") {
          const burough5Element = await awaitElementLocatedAndReturn(
            driver,
            taxWebsiteSelectors.burough5,
            "xpath"
          );
          await burough5Element.click();
        }

        const blockInputFieldElement = await awaitElementLocatedAndReturn(
          driver,
          taxWebsiteSelectors.blockInputField,
          "id"
        );
        await driver.sleep(5000);
        await deleteInputFieldContents(blockInputFieldElement);
        await blockInputFieldElement.sendKeys(blockNumber);

        await driver.sleep(5000);
        const lotInputFieldElement = await awaitElementLocatedAndReturn(
          driver,
          taxWebsiteSelectors.lotInputField,
          "id"
        );
        await deleteInputFieldContents(lotInputFieldElement);
        await lotInputFieldElement.sendKeys(lotNumber);

        await driver.sleep(5000);
        const taxWebsiteSearchBtn = await awaitElementLocatedAndReturn(
          driver,
          taxWebsiteSelectors.searchButton,
          "id"
        );

        await driver.sleep(5000);
        await taxWebsiteSearchBtn.click();
        const resultsNotPresent = await checkIfNoResultsOrMultipleResults(
          driver,
          item,
          taxWebsiteSelectors,
          arrayOfFailedOperations
        );
        if (resultsNotPresent === true) {
          continue;
        }

        // Get side menu so it can be used to safely get Tab Bill tab
        const sideMenuTabElement = await awaitElementLocatedAndReturn(
          driver,
          taxWebsiteSelectors.sideMenuTab,
          "id"
        );
        const propertyTaxBillsTab = await sideMenuTabElement.findElement(
          By.xpath(taxWebsiteSelectors.propertyTaxBillsTab)
        );
        await propertyTaxBillsTab.click();
        await driver.wait(until.urlContains("soa_docs"));
        await driver.sleep(5000);
        /* 
            Before trying to download, need to check for the table element which contains the
            links to ensure the script doesn't get stuck
          */

        const continueExecution = await checkForTaxBillTable(
          driver,
          taxWebsiteSelectors
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
          continue;
        }

        try {
          /* 
                Because of the way the DOM is structured, it's necessary to parse out the correct
                anchor tag this way 
              */
          const downloadLinkChildXPath = generateDynamicXPath(
            "u",
            `Q${installmentNumber}: `,
            "contains"
          );
          const downloadLinkChild = await driver.findElement(
            By.xpath(downloadLinkChildXPath)
          );
          const downloadLink = await downloadLinkChild.findElement(
            By.xpath("./../..")
          );

          const fileNameForFile = `${item.CompanyName} ${item.EntityName} ${item.ParcelNumber}`;

          const downloadSucceeded = await saveLinkToFile(
            downloadLink,
            outputDirectory,
            fileNameForFile,
            "pdf"
          );

          if (downloadSucceeded === true) {
            console.log(
              colors.yellow.bold(
                `Parcel: ${item.ParcelNumber} downloaded successfuly`
              )
            );
          } else {
            console.log(
              colors.red.bold(`Parcel: ${item.ParcelNumber} failed to download`)
            );
            consoleLogLine();
            arrayOfFailedOperations.push(item);
          }
        } catch (error) {
          console.log(
            colors.red.bold(`Parcel: ${item.ParcelNumber} failed to download`)
          );
          consoleLogLine();
          arrayOfFailedOperations.push(item);
        }

        //Sleep to give time to download file
        const amountToSleep = generateDelayNumber();
        await driver.sleep(amountToSleep);

        await driver.navigate().back();
        await driver.navigate().back();

        arrayOfSuccessfulOperations.push(item);
        console.log(
          colors.green.bold(`Succeeded for parcel: ${item.ParcelNumber}`)
        );
        consoleLogLine();
      } catch (error) {
        console.log(colors.red.bold(`Failed for parcel: ${item.ParcelNumber}`));
        consoleLogLine();
        arrayOfFailedOperations.push(item);
      }
    }

    await printAutomationReportToSheet(
      arrayOfSuccessfulOperations,
      arrayOfFailedOperations,
      "./output/"
    );

    console.log(
      colors.blue.bold(
        `Reports have been generated for parcels that were added successful and unsuccessfuly, located in the output folder. Please check the 'Failed Operations' tab to verify if any results need manual review.`
      ),
      "\n"
    );
    await closingAutomationSystem();
  } catch (error) {
    logErrorMessageCatch(error);
  }
};

module.exports = performDownload;
