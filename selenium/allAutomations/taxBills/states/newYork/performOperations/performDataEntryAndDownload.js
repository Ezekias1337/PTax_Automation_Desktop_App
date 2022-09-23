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
const promptLogin = require("../../../../../functions/userPrompts/individual/promptLogin");
const promptUploadDirectory = require("../../../../../functions/userPrompts/individual/promptUploadDirectory");
const loginToPTAX = require("../../../../../functions/pTaxSpecific/login/loginToPTAX");
const saveLinkToFile = require("../../../../../functions/fileOperations/saveLinkToFile");
const trimLeadingZeros = require("../../../../../functions/general/trimLeadingZeros");
const swapToIFrameDefaultContent = require("../../../../../functions/pTaxSpecific/frameSwaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../../../../functions/pTaxSpecific/frameSwaps/swapToIFrame0");
const swapToIFrame1 = require("../../../../../functions/pTaxSpecific/frameSwaps/swapToIFrame1");
const clickCheckMyPropertiesCheckBox = require("../../../../../functions/pTaxSpecific/clickCheckMyPropertiesCheckBox/clickCheckMyPropertiesCheckBox");
const openNewTab = require("../../../../../functions/tabSwapsAndHandling/openNewTab");
const switchToPTaxTab = require("../../../../../functions/tabSwapsAndHandling/switchToPTaxTab");
const switchToTaxWebsiteTab = require("../../../../../functions/tabSwapsAndHandling/switchToTaxWebsiteTab");
const { nyTaxBillSite } = require("../../../../../constants/urls");
const consoleLogLine = require("../../../../../functions/general/consoleLogLine");
const generateDelayNumber = require("../../../../../functions/general/generateDelayNumber");
const navigateToExistingAssessment = require("../../../../../functions/navigateToExistingAssessment/navigateToExistingAssessment");
const sendKeysPTaxInputFields = require("../../../../../functions/pTaxSpecific/sendKeysPTaxInputFields/sendKeysPTaxInputFields");
const {
  dataEntryTaxBillsColumns,
} = require("../../../../../dataValidation/spreadsheetColumns/allSpreadSheetColumns");
const {
  assessmentNoticesSelectors,
  navbarDocumentsSelectors,
  searchByParcelNumberSelector,
  taxBillSelectors,
} = require("../../../../../ptaxXpathsAndSelectors/allSelectors");

// Helpers
const checkForTaxBillTable = require("../helpers/checkForTaxBillTable");
const checkIfNoResultsOrMultipleResults = require("../helpers/checkIfNoResultsOrMultipleResults");
const checkIfSessionExpired = require("../helpers/checkIfSessionExpired");
const checkIfWebsiteUnderMaintenance = require("../helpers/checkIfWebsiteUnderMaintenance");
const pullTaxBillStrings = require("../helpers/pullTaxBillStrings");
const bblSearch = require("../helpers/bblSearch");
const fillOutLiability = require("../helpers/fillOutLiability");
const fillOutPayments = require("../helpers/fillOutPayments");

const performDataEntryAndDownload = async (
  state,
  sublocation,
  operation,
  taxWebsiteSelectors
) => {
  /* 
      Goes to the NY Tax Bill website, downloads the bill, then gets the
      payment for the period under Account Balance Details section. Subsequently goes
      to PTAX, performs the data entry, deletes the data from the other installments,
      and finally uploads the PDF of the Bill 
    */

  const arrayOfSuccessfulOperations = [];
  const arrayOfFailedOperations = [];

  try {
    console.log(`Running Tax Bill Data Entry Automation: `);

    const dataFromSpreadsheet = await readSpreadsheetFile();
    const uploadDirectory = await promptUploadDirectory("upload");
    const installmentNumber = await promptForInstallment();
    const [areCorrectSheetColumnsPresent, arrayOfMissingColumnNames] =
      verifySpreadSheetColumnNames(
        dataEntryTaxBillsColumns,
        dataFromSpreadsheet[0]
      );

    await handleColumnNameLogging(
      areCorrectSheetColumnsPresent,
      arrayOfMissingColumnNames
    );
    if (areCorrectSheetColumnsPresent === false) {
      return;
    }

    const { username, password } = await promptLogin();
    const [ptaxWindow, driver] = await loginToPTAX(username, password);

    /* These values will be null if the login failed, this will cause the execution
      to stop */

    if (ptaxWindow === null || driver === null) {
      return;
    }

    await swapToIFrame0(driver);
    await clickCheckMyPropertiesCheckBox(driver);

    await openNewTab(driver);
    await driver.get(nyTaxBillSite);
    const taxWebsiteWindow = await driver.getWindowHandle();

    const maintenanceStatus = await checkIfWebsiteUnderMaintenance(driver);
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

        await checkIfSessionExpired(driver, taxWebsiteSelectors);
        await bblSearch(driver, item, taxWebsiteSelectors);

        const resultsNotPresent = await checkIfNoResultsOrMultipleResults(
          driver,
          item,
          taxWebsiteSelectors,
          arrayOfFailedOperations
        );
        if (resultsNotPresent === true) {
          continue;
        }

        /* 
            -----------------------------------------Download the bill--------------------------------
        */

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

        /* 
            -----------------------------------------Pull Tax Data Strings--------------------------------
        */

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


        const [installmentTotalString, installmentTotalInt] =
          await pullTaxBillStrings(
            driver,
            taxWebsiteSelectors,
            installmentNumber
          );
        const bblSearchBtn = driver.findElement(
          By.xpath(taxWebsiteSelectors.bblSearchBtn)
        );
        await bblSearchBtn.click();
        await driver.wait(
          until.urlContains("search/commonsearch.aspx?mode=persprop")
        );
        await switchToPTaxTab(driver, ptaxWindow);

        // Navigate to parcel in PTax

        await driver.navigate().refresh();
        await swapToIFrameDefaultContent(driver);

        const searchByParcelInput = await awaitElementLocatedAndReturn(
          driver,
          searchByParcelNumberSelector,
          "id"
        );
        await sendKeysPTaxInputFields(
          searchByParcelInput,
          item.ParcelNumber,
          true
        );

        await swapToIFrame0(driver);
        propertySideBarXPath = generateDynamicXPath(
          "a",
          item.ParcelNumber,
          "contains"
        );
        const propertyToAddTaxBill = await awaitElementLocatedAndReturn(
          driver,
          propertySideBarXPath,
          "xpath"
        );
        await propertyToAddTaxBill.click();
        await driver.sleep(2500);

        await swapToIFrame1(driver);
        await navigateToExistingAssessment(driver);

        // Fill out the input fields and save

        const twoOrFourInstallments = await fillOutLiability(
          driver,
          taxBillSelectors,
          installmentTotalString
        );
        await fillOutPayments(
          driver,
          taxBillSelectors,
          installmentTotalString,
          installmentNumber,
          twoOrFourInstallments
        );

        // Upload Document

        // April did not want this for 85Jay Street/Trump Soho 6/8/2022, will add later

        // Reset to default

        await swapToIFrame0(driver);
        await switchToTaxWebsiteTab(driver, taxWebsiteWindow);
        /* const amountToSleep = generateDelayNumber();
        await driver.sleep(amountToSleep); */

        arrayOfSuccessfulOperations.push(item);
        console.log(
          colors.green.bold(`Succeeded for parcel: ${item.ParcelNumber}`)
        );
        consoleLogLine();
      } catch (error) {
        console.log("ERROR CAUSING ISSUES: ", error);
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

module.exports = performDataEntryAndDownload;
