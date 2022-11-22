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
const checkIfObjectIsEmpty = require("../../../../../../shared/utils/checkIfObjectIsEmpty");

// Helpers

const performDataEntryAndDownload = async (
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

    await sendEventLogInfo(ipcBusClientNodeMain, {
      color: "yellow",
      message: "Logging into Parcel Quest",
    });
    await openNewTab(driver);
    await driver.get(parcelQuestLoginPage);
    await driver.wait(until.urlIs(parcelQuestLoginPage));
    const taxWebsiteWindow = await driver.getWindowHandle();

    const loginToParcelQuestSuccessful = await loginToParcelQuest(
      driver,
      parcelQuestUsername,
      parcelQuestPassword,
      websiteSelectors,
      parcelQuestLoginPage,
      parcelQuestHomePage
    );

    /* 
        if loginToParcelQuestSuccessful is false,
        it means the login credentials are invalid,
        or the selectors are no longer valid
    */
    if (loginToParcelQuestSuccessful === false) {
      await sendEventLogInfo(ipcBusClientNodeMain, {
        color: "red",
        message:
          "Login to Parcel Quest failed! Please check your username and password.",
      });
      return;
    }
    await sendEventLogInfo(ipcBusClientNodeMain, {
      color: "green",
      message: "Login into Parcel Quest Successful!",
    });

    for (const item of spreadsheetContents) {
      try {
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "regular",
          message: `Working on Parcel Number: ${item.ParcelNumber}`,
        });
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
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "orange",
          message: `Searching for: ${item.ParcelNumber}`,
        });
        const searchSuccessful = await searchForParcel(
          driver,
          item.ParcelNumber,
          county,
          websiteSelectors,
          "up"
        );
        if (searchSuccessful === false) {
          arrayOfFailedOperations.push(item);

          await sendFailedIteration(
            ipcBusClientNodeMain,
            item,
            `Failed to find parcel: ${item.ParcelNumber} in database.`
          );
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
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "orange",
          message: `Navigating to bill for: ${item.ParcelNumber}`,
        });
        await driver.sleep(6000);
        const arrayOfPossibleTaxBillDataTabElements = await driver.findElements(
          By.css(websiteSelectors.taxBillDataTab)
        );
        const taxBillDataTabElement = arrayOfPossibleTaxBillDataTabElements[1];
        await taxBillDataTabElement.click();
        await driver.sleep(2000);

        /* 
          Now verify that parcelquest yielded results by getting the pagination element,
          if the innertext === -1, no data was found (there are two elements, get the 2nd)
        */
        const parcelQuestPaginationArray = await driver.findElements(
          By.css(websiteSelectors.parcelQuestPagination, "css")
        );
        const parcelQuestPaginationCorrectEle = parcelQuestPaginationArray[1];
        const paginationString =
          await parcelQuestPaginationCorrectEle.getAttribute("innerText");
        if (paginationString === "-1") {
          arrayOfFailedOperations.push(item);

          await sendFailedIteration(
            ipcBusClientNodeMain,
            item,
            `Parcel quest failed to render the tax data for: ${item.ParcelNumber}.`
          );
          await sendEventLogInfo(ipcBusClientNodeMain, {
            color: "red",
            message: `Parcel quest failed to render the tax data for: ${item.ParcelNumber}.`,
          });
          await pressHomeButton(driver);
          continue;
        }

        /* 
          Now ensure that we are on the tax bill data tab
        */

        const navigatedToBillSuccessfully = await fluentWait(
          driver,
          websiteSelectors.taxSummaryDiv,
          "xpath",
          20,
          2
        );
        if (navigatedToBillSuccessfully === false) {
          arrayOfFailedOperations.push(item);

          await sendFailedIteration(
            ipcBusClientNodeMain,
            item,
            `Failed to navigate to the bill for parcel: ${item.ParcelNumber}.`
          );
          await sendEventLogInfo(ipcBusClientNodeMain, {
            color: "red",
            message: `Failed to navigate to the bill for parcel: ${item.ParcelNumber}.`,
          });
          await pressHomeButton(driver);
          continue;
        }

        /* 
            Download the bill
        */
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "purple",
          message: `Downloading bill for: ${item.ParcelNumber}`,
        });
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
          await sendFailedIteration(
            ipcBusClientNodeMain,
            item,
            `Failed to download the bill for parcel: ${item.ParcelNumber}.`
          );
          await sendEventLogInfo(ipcBusClientNodeMain, {
            color: "red",
            message: `Failed to download the bill for parcel: ${item.ParcelNumber}.`,
          });
          await pressHomeButton(driver);
          continue;
        }
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "blue",
          message: `Bill for: ${item.ParcelNumber} downloaded successfully`,
        });

        /* 
            Pull Tax Data Strings
        */

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "orange",
          message: `Pulling Tax Data for: ${item.ParcelNumber}`,
        });
        let taxDataStringObject = await pullTaxBillStrings(
          driver,
          taxYear,
          county,
          websiteSelectors
        );
        if (checkIfObjectIsEmpty(taxDataStringObject)) {
          /* 
            Try getting tax data one more time in case
            parcelQuest failed to load
          */
          await pressHomeButton(driver);
          taxDataStringObject = await pullTaxBillStrings(
            driver,
            taxYear,
            county,
            websiteSelectors
          );
          /* 
            If this still returns 0, something else is wrong
          */
          if (checkIfObjectIsEmpty(taxDataStringObject)) {
            arrayOfFailedOperations.push(item);
            await sendFailedIteration(
              ipcBusClientNodeMain,
              item,
              `Failed to pull tax data for parcel: ${item.ParcelNumber}.`
            );
            await sendEventLogInfo(ipcBusClientNodeMain, {
              color: "red",
              message: `Failed to pull tax data for parcel: ${item.ParcelNumber}.`,
            });
            await pressHomeButton(driver);
            continue;
          }
        }
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "regular",
          message: `Total taxes due: ${taxDataStringObject.totalTaxesDue} || Total NAVs due: ${taxDataStringObject.totalNAVs}`,
        });

        /* 
            Ptax Data Entry
        */

        // Navigate to parcel in PTax
        await switchToPTaxTab(driver, ptaxWindow);
        await driver.navigate().refresh();
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

        const installmentStringOne =
          taxDataStringObject.installmentOneAmountDue;

        const installmentStringTwo =
          taxDataStringObject.installmentTwoAmountDue;

        await fillOutPayments(
          driver,
          taxBillSelectors,
          installmentStringOne,
          installmentStringTwo,
          installmentNumber
        );

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "purple",
          message: `Uploading Bill for: ${item.ParcelNumber}`,
        });
        // Upload Document
        await uploadTaxBill(
          driver,
          fileNameForFile,
          taxYear,
          taxYearEnd,
          downloadDirectory,
          "Annual (PQ)"
        );
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "green",
          message: `Bill successfully uploaded for: ${item.ParcelNumber}`,
        });

        await swapToIFrame0(driver);
        await switchToTaxWebsiteTab(driver, taxWebsiteWindow);
        const homeButton = await awaitElementLocatedAndReturn(
          driver,
          websiteSelectors.homeButton,
          "css"
        );
        await homeButton.click();

        arrayOfSuccessfulOperations.push(item);
        let itemErrorColRemoved = item;
        if(itemErrorColRemoved?.Error) {
          delete itemErrorColRemoved.Error
        }
        await sendSuccessfulIteration(ipcBusClientNodeMain, itemErrorColRemoved);
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "green",
          message: `Succeeded for parcel: ${item.ParcelNumber}`,
        });
        console.log(
          colors.green.bold(`Succeeded for parcel: ${item.ParcelNumber}`)
        );
        consoleLogLine();
      } catch (error) {
        /*
          Here I have to add an artificial delay, because if too many parcels fail in quick
          succession, it causes the app to crash
        */
        await driver.sleep(6500);
        await sendFailedIteration(
          ipcBusClientNodeMain,
          item,
          `Failed for parcel: ${item.ParcelNumber}`
        );
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "red",
          message: `Failed for parcel: ${item.ParcelNumber}`,
        });
        const urlPostFailure = await driver.getCurrentUrl();
        if (urlPostFailure !== parcelQuestHomePage) {
          await switchToTaxWebsiteTab(taxWebsiteWindow);
        }

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

module.exports = performDataEntryAndDownload;
