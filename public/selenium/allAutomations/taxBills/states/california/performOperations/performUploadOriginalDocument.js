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
const loginToParcelQuest = require("../helpers/loginToParcelQuest");
const saveLinkToFile = require("../../../../../functions/fileOperations/saveLinkToFile");
const trimLeadingZeros = require("../../../../../functions/general/trimLeadingZeros");
const swapToIFrameDefaultContent = require("../../../../../functions/pTaxSpecific/frameSwaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../../../../functions/pTaxSpecific/frameSwaps/swapToIFrame0");
const swapToIFrame1 = require("../../../../../functions/pTaxSpecific/frameSwaps/swapToIFrame1");
const clickCheckMyPropertiesCheckBox = require("../../../../../functions/pTaxSpecific/clickCheckMyPropertiesCheckBox/clickCheckMyPropertiesCheckBox");
const openNewTab = require("../../../../../functions/tabSwapsAndHandling/openNewTab");
const switchToPTaxTab = require("../../../../../functions/tabSwapsAndHandling/switchToPTaxTab");
const switchToTaxWebsiteTab = require("../../../../../functions/tabSwapsAndHandling/switchToTaxWebsiteTab");
const {
  parcelQuestLoginPage,
  parcelQuestHomePage,
} = require("../../../../../constants/urls");
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
const websiteSelectors = require("../websiteSelectors");
const sendCurrentIterationInfo = require("../../../../../ipc-bus/sendCurrentIterationInfo");
const sendSuccessfulIteration = require("../../../../../ipc-bus/sendSuccessfulIteration");
const sendFailedIteration = require("../../../../../ipc-bus/sendFailedIteration");
const sendEventLogInfo = require("../../../../../ipc-bus/sendEventLogInfo");
const sendAutomationCompleted = require("../../../../../ipc-bus/sendAutomationCompleted");
const searchForParcel = require("../helpers/searchForParcel");
const pullTaxBillStrings = require("../helpers/pullTaxBillStrings");
const printPageToPDF = require("../../../../../functions/fileOperations/printPageToPDF");
const fillOutLiability = require("../helpers/fillOutLiability");
const fillOutPayments = require("../helpers/fillOutPayments");
const selectDropdownElement = require("../../../../../utils/web-elements/selectDropdownElement");
const uploadTaxBill = require("../../../cross-state-helpers/uploadTaxBill");
const {
  replaceSpacesWithUnderscore,
} = require("../../../../../../shared/utils/replaceSpacesWithUnderscore");
const fluentWait = require("../../../../../functions/general/fluentWait");
const waitForLoading = require("../../../../../functions/pTaxSpecific/waitForLoading/waitForLoading");
const scrollElementIntoView = require("../../../../../functions/general/scrollElementIntoView");
const pressHomeButton = require("../helpers/pressHomeButton");
const handleAutomationCancel = require("../../../../../ipc-bus/handleAutomationCancel");

// Helpers

const performUploadOriginalDocument = async (
  {
    taxYear,
    downloadDirectory,
    ptaxUsername,
    ptaxPassword,
    parcelQuestUsername,
    parcelQuestPassword,
    spreadsheetContents,
    county,
    installmentNumber,
  },
  ipcBusClientNodeMain
) => {
  const arrayOfSuccessfulOperations = [];
  const arrayOfFailedOperations = [];

  try {
    const taxYearEnd = parseInt(taxYear) + 1;

    await sendEventLogInfo(ipcBusClientNodeMain, {
      color: "yellow",
      message: "Logging into Ptax",
    });
    const [ptaxWindow, driver] = await loginToPTAX(ptaxUsername, ptaxPassword);
    handleAutomationCancel(ipcBusClientNodeMain, driver);

    /* 
        These values will be null if the login failed, this will cause the execution
        to stop. If it fails before even loading ptax, it means
        that the chrome web driver is out of date. Otherwise,
        it means the login credentials are incorrect 
    */

    if (ptaxWindow === null || driver === null) {
      await sendEventLogInfo(ipcBusClientNodeMain, {
        color: "red",
        message:
          "Login to PTax failed! Please check your username and password.",
      });
      return;
    }
    await sendEventLogInfo(ipcBusClientNodeMain, {
      color: "green",
      message: "Login into Ptax Successful!",
    });

    await swapToIFrame0(driver);
    await clickCheckMyPropertiesCheckBox(driver);

    for (const item of spreadsheetContents) {
      try {
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "regular",
          message: `Working on Parcel Number: ${item.ParcelNumber}`,
        });
        await sendCurrentIterationInfo(ipcBusClientNodeMain, item.ParcelNumber);

        await driver.navigate().refresh();

        /* 
          Navigate to parcel in PTax
        */

        await swapToIFrameDefaultContent(driver);
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "blue",
          message: `Searching for: ${item.ParcelNumber} in Ptax`,
        });

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
        const propertySideBarXPath = generateDynamicXPath(
          "a",
          item.ParcelNumber,
          "contains"
        );
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "regular",
          message: `Navigating to existing assessment`,
        });
        const propertyToAddTaxBill = await awaitElementLocatedAndReturn(
          driver,
          propertySideBarXPath,
          "xpath"
        );
        await propertyToAddTaxBill.click();
        await driver.sleep(2500);

        /* 
          ? Per April some counties might have more than one assessment,
          ? need to circle back with her to figure out how to handle
          ? this edge case
        */
        await swapToIFrame1(driver);
        await navigateToExistingAssessment(driver);

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "blue",
          message: `Performing Data Entry for: ${item.ParcelNumber}`,
        });

        // Change Assessment Data Source to ParcelQuest and save
        await selectDropdownElement(
          driver,
          taxBillSelectors.dataSourceAssessment,
          "Legal Document"
        );
        const saveAssessmentButton = await awaitElementLocatedAndReturn(
          driver,
          taxBillSelectors.btnSaveAssessment,
          "id"
        );
        await scrollElementIntoView(driver, saveAssessmentButton);
        await saveAssessmentButton.click();
        await waitForLoading(driver);

        await selectDropdownElement(
          driver,
          taxBillSelectors.dataSourceLiability,
          "Legal Document",
          true,
          taxBillSelectors.dataSourceLiabilityLegalDocument
        );

        const saveLiabilityButton = await awaitElementLocatedAndReturn(
          driver,
          taxBillSelectors.saveLiability,
          "id"
        );
        await scrollElementIntoView(driver, saveLiabilityButton);
        await saveLiabilityButton.click();
        await waitForLoading(driver);

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "purple",
          message: `Uploading Bill for: ${item.ParcelNumber}`,
        });

        /* 
          Upload Document
        */
        const fileNameForFile = replaceSpacesWithUnderscore(
          `${item.CompanyName} ${item.EntityName} ${item.ParcelNumber}`
        );
        await uploadTaxBill(
          driver,
          fileNameForFile,
          taxYear,
          taxYearEnd,
          downloadDirectory,
          "Annual"
        );
        await driver.sleep(2500);
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "green",
          message: `Bill successfully uploaded for: ${item.ParcelNumber}`,
        });
        await driver.sleep(2500);
        await swapToIFrame0(driver);

        arrayOfSuccessfulOperations.push(item);
        await sendSuccessfulIteration(ipcBusClientNodeMain, item);
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "green",
          message: `Succeeded for parcel: ${item.ParcelNumber}`,
        });
        console.log(
          colors.green.bold(`Succeeded for parcel: ${item.ParcelNumber}`)
        );
        consoleLogLine();
      } catch (error) {
        await sendFailedIteration(
          ipcBusClientNodeMain,
          item,
          `Failed for parcel: ${item.ParcelNumber} || ${error.message}`
        );
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "red",
          message: `Failed for parcel: ${item.ParcelNumber} || ${error.message}`,
        });
        await driver.navigate().refresh();
        console.log(colors.red.bold(`Failed for parcel: ${item.ParcelNumber}`));
        consoleLogLine();
        arrayOfFailedOperations.push(item);
      }
    }

    await printAutomationReportToSheet(
      arrayOfSuccessfulOperations,
      arrayOfFailedOperations,
      downloadDirectory
    );

    await sendAutomationCompleted(ipcBusClientNodeMain);
    await sendEventLogInfo(ipcBusClientNodeMain, {
      color: "blue",
      message: "The automation is complete.",
    });
    console.log(
      colors.blue.bold(
        `Reports have been generated for parcels that were added successful and unsuccessfuly, located in the download folder. Please check the 'Failed Operations' tab to verify if any results need manual review.`
      ),
      "\n"
    );
    await closingAutomationSystem(driver);
  } catch (error) {
    logErrorMessageCatch(error);
  }
};

module.exports = performUploadOriginalDocument;
