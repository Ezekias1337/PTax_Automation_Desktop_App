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
const sendEventLogInfo = require("../../../../../ipc-bus/sendEventLogInfo");
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

// Helpers

const performDataEntryAndDownload = async (
  {
    assessmentYear,
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
    const assessmentYearEnd = parseInt(assessmentYear) + 1;
    const [ptaxWindow, driver] = await loginToPTAX(ptaxUsername, ptaxPassword);

    /* 
        These values will be null if the login failed, this will cause the execution
        to stop. If it fails before even loading ptax, it means
        that the chrome web driver is out of date. Otherwise,
        it means the login credentials are incorrect 
    */

    if (ptaxWindow === null || driver === null) {
      return;
    }

    await swapToIFrame0(driver);
    await clickCheckMyPropertiesCheckBox(driver);

    await openNewTab(driver);
    await driver.get(parcelQuestLoginPage);
    const taxWebsiteWindow = await driver.getWindowHandle();

    const loginToParcelQuestSuccessful = await loginToParcelQuest(
      driver,
      parcelQuestUsername,
      parcelQuestPassword,
      websiteSelectors,
      parcelQuestHomePage
    );

    /* 
        if loginToParcelQuestSuccessful is false,
        it means the login credentials are invalid,
        or the selectors are no longer valid
    */
    if (loginToParcelQuestSuccessful === false) {
      return;
    }

    for (const item of spreadsheetContents) {
      try {
        await sendCurrentIterationInfo(ipcBusClientNodeMain, item.ParcelNumber);

        /* 
          Reset the browser tabs for new iteration
        */
        const currentUrl = await driver.getCurrentUrl();
        if (currentUrl !== parcelQuestHomePage) {
          await driver.sleep(5000);
          await driver.get(parcelQuestLoginPage);
          await loginToParcelQuest(
            driver,
            parcelQuestUsername,
            parcelQuestPassword,
            websiteSelectors,
            parcelQuestHomePage
          );
        }

        /* 
          Proceed with iteration
        */
        const searchSuccessful = await searchForParcel(
          driver,
          item.ParcelNumber,
          county,
          websiteSelectors,
          "up"
        );
        if (searchSuccessful === false) {
          arrayOfFailedOperations.push(item);

          await sendEventLogInfo(ipcBusClientNodeMain, {
            color: "red",
            message: `Failed to find parcel: ${item.ParcelNumber} in database.`,
          });
          await switchToTaxWebsiteTab(taxWebsiteWindow);
          continue;
        }

        /* 
          Navigate to the bill
          
          For some reason parcel quest has tons of duplicate elements which share a selector, but
          are not visible in the DOM. To get to the Tax Bill Data, we must select the 2nd element
          returned from the array.
        */
        await driver.sleep(2000);
        const arrayOfPossibleTaxBillDataTabElements = await driver.findElements(
          By.css(websiteSelectors.taxBillDataTab)
        );
        const taxBillDataTabElement = arrayOfPossibleTaxBillDataTabElements[1];
        await taxBillDataTabElement.click();
        await driver.sleep(2000);
        const navigatedToBillSuccessfully = await fluentWait(
          driver,
          websiteSelectors.taxSummaryDiv,
          "xpath",
          10,
          2
        );
        if (navigatedToBillSuccessfully === false) {
          arrayOfFailedOperations.push(item);

          await sendEventLogInfo(ipcBusClientNodeMain, {
            color: "red",
            message: `Failed to navigate to the bill for parcel: ${item.ParcelNumber}.`,
          });
          await switchToTaxWebsiteTab(taxWebsiteWindow);
          continue;
        }

        /* 
            Download the bill
        */
        const fileNameForFile = replaceSpacesWithUnderscore(
          `${item.CompanyName} ${item.EntityName} ${item.ParcelNumber}`
        );
        const billDownloadedSuccessfully = await printPageToPDF(
          driver,
          downloadDirectory,
          fileNameForFile,
          websiteSelectors.screenShotSelector,
          false
        );
        if (billDownloadedSuccessfully === false) {
          arrayOfFailedOperations.push(item);
          await sendEventLogInfo(ipcBusClientNodeMain, {
            color: "red",
            message: `Failed to download the bill for parcel: ${item.ParcelNumber}.`,
          });
          await switchToTaxWebsiteTab(taxWebsiteWindow);
          continue;
        }

        /* 
            Pull Tax Data Strings
        */

        const taxDataStringObject = await pullTaxBillStrings(
          driver,
          assessmentYear,
          county,
          websiteSelectors
        );
        if (Object.keys(taxDataStringObject).length === 0) {
          arrayOfFailedOperations.push(item);
          await sendEventLogInfo(ipcBusClientNodeMain, {
            color: "red",
            message: `Failed to pull tax data for parcel: ${item.ParcelNumber}.`,
          });
          await switchToTaxWebsiteTab(taxWebsiteWindow);
          continue;
        }

        /* 
            Ptax Data Entry
        */

        // Navigate to parcel in PTax
        await switchToPTaxTab(driver, ptaxWindow);
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
        const propertySideBarXPath = generateDynamicXPath(
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

        /* 
          ? Per April some counties might have more than one assessment,
          ? need to circle back with her to figure out how to handle
          ? this edge case
        */
        await swapToIFrame1(driver);
        await navigateToExistingAssessment(driver);

        // Change Assessment Data Source to ParcelQuest and save
        await selectDropdownElement(
          driver,
          taxBillSelectors.dataSourceAssessment,
          "ParcelQuest"
        );
        const saveAssessmentButton = await awaitElementLocatedAndReturn(
          driver,
          taxBillSelectors.btnSaveAssessment,
          "id"
        );
        await scrollElementIntoView(driver, saveAssessmentButton);
        await saveAssessmentButton.click();
        await waitForLoading(driver);

        // Fill out the input fields and save
        await fillOutLiability(
          driver,
          taxBillSelectors,
          taxDataStringObject.totalTaxesDue,
          taxDataStringObject.totalNAVs
        );

        let installmentStringForPaymentsFunction;
        if (installmentNumber === "1") {
          installmentStringForPaymentsFunction =
            taxDataStringObject.installmentOneAmountDue;
        } else if (installmentNumber === "2") {
          installmentStringForPaymentsFunction =
            taxDataStringObject.installmentTwoAmountDue;
        }

        await fillOutPayments(
          driver,
          taxBillSelectors,
          installmentStringForPaymentsFunction,
          installmentNumber
        );

        // Upload Document
        await uploadTaxBill(
          driver,
          fileNameForFile,
          assessmentYear,
          assessmentYearEnd,
          downloadDirectory,
          "Parcel Quest"
        );

        await swapToIFrame0(driver);
        await switchToTaxWebsiteTab(driver, taxWebsiteWindow);
        const homeButton = await awaitElementLocatedAndReturn(
          driver,
          websiteSelectors.homeButton,
          "css"
        );
        await homeButton.click();

        arrayOfSuccessfulOperations.push(item);
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "green",
          message: `Succeeded for parcel: ${item.ParcelNumber}`,
        });
        console.log(
          colors.green.bold(`Succeeded for parcel: ${item.ParcelNumber}`)
        );
        consoleLogLine();
      } catch (error) {
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "green",
          message: `Failed for parcel: ${item.ParcelNumber}`,
        });
        await switchToTaxWebsiteTab(taxWebsiteWindow);
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

    await sendEventLogInfo(ipcBusClientNodeMain, {
      color: "blue",
      message:
        "Reports have been generated for parcels that were added successful and unsuccessfuly, located in the download folder. Please check the 'Failed Operations' tab to verify if any results need manual review.",
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

module.exports = performDataEntryAndDownload;
