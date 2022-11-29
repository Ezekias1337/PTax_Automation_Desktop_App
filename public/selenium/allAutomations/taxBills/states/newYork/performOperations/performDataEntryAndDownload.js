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

// New imports from re-factor
const sendCurrentIterationInfo = require("../../../../../ipc-bus/sendCurrentIterationInfo");
const sendSuccessfulIteration = require("../../../../../ipc-bus/sendSuccessfulIteration");
const sendFailedIteration = require("../../../../../ipc-bus/sendFailedIteration");
const sendEventLogInfo = require("../../../../../ipc-bus/sendEventLogInfo");
const sendAutomationCompleted = require("../../../../../ipc-bus/sendAutomationCompleted");
const handleAutomationCancel = require("../../../../../ipc-bus/handleAutomationCancel");
const websiteSelectors = require("../websiteSelectors");

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
  /* 
      Goes to the NY Tax Bill website, downloads the bill, then gets the
      payment for the period under Account Balance Details section. Subsequently goes
      to PTAX, performs the data entry, deletes the data from the other installments,
      and finally uploads the PDF of the Bill 
    */

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
      message: "Navigating to tax website",
    });
    await openNewTab(driver);
    await driver.get(nyTaxBillSite);
    const taxWebsiteWindow = await driver.getWindowHandle();

    const maintenanceStatus = await checkIfWebsiteUnderMaintenance(driver);
    if (maintenanceStatus === true) {
      await sendEventLogInfo(ipcBusClientNodeMain, {
        color: "red",
        message: "Website Under Maintenance.",
      });
      return;
    }

    const agreeBtnElement = await awaitElementLocatedAndReturn(
      driver,
      websiteSelectors.agreeBtn,
      "id"
    );
    await agreeBtnElement.click();
    await sendEventLogInfo(ipcBusClientNodeMain, {
      color: "purple",
      message: "Beginning work on first parcel...",
    });

    for (const item of spreadsheetContents) {
      try {
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "orange",
          message: `Working on parcel: ${item.ParcelNumber}`,
        });
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "blue",
          message: "Checking if session expired",
        });
        await checkIfSessionExpired(driver, websiteSelectors);

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "yellow",
          message: `Searching for parcel: ${item.ParcelNumber}`,
        });
        await bblSearch(driver, item, websiteSelectors);

        const resultsNotPresent = await checkIfNoResultsOrMultipleResults(
          driver,
          item,
          websiteSelectors,
          arrayOfFailedOperations
        );
        if (resultsNotPresent === false) {
          arrayOfFailedOperations.push(item);

          await switchToTaxWebsiteTab(taxWebsiteWindow);
          await sendFailedIteration(
            ipcBusClientNodeMain,
            item,
            `Failed to find parcel: ${item.ParcelNumber} in database.`
          );
          await sendEventLogInfo(ipcBusClientNodeMain, {
            color: "red",
            message: `Failed to find parcel: ${item.ParcelNumber} in database.`,
          });

          continue;
        }

        /* 
            -----------------------------------------Download the bill--------------------------------
        */

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "regular",
          message: `Navigating to bill for parcel: ${item.ParcelNumber}`,
        });

        const sideMenuTabElement = await awaitElementLocatedAndReturn(
          driver,
          websiteSelectors.sideMenuTab,
          "id"
        );
        const propertyTaxBillsTab = await sideMenuTabElement.findElement(
          By.xpath(websiteSelectors.propertyTaxBillsTab)
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
          websiteSelectors
        );

        if (continueExecution === false) {
          await driver.navigate().back();
          await driver.navigate().back();
          arrayOfFailedOperations.push(item);
          await sendFailedIteration(
            ipcBusClientNodeMain,
            item,
            `Failed for parcel: ${item.ParcelNumber} Parcel found, but no tax bill in database`
          );
          await sendEventLogInfo(ipcBusClientNodeMain, {
            color: "red",
            message: `Failed for parcel: ${item.ParcelNumber} Parcel found, but no tax bill in database`,
          });

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
            downloadDirectory,
            fileNameForFile,
            "pdf"
          );

          if (downloadSucceeded === true) {
            await sendEventLogInfo(ipcBusClientNodeMain, {
              color: "yellow",
              message: `Parcel: ${item.ParcelNumber} downloaded successfuly`,
            });
          } else {
            arrayOfFailedOperations.push(item);
            await sendFailedIteration(
              ipcBusClientNodeMain,
              item,
              `Parcel: ${item.ParcelNumber} failed to download`
            );
            await sendEventLogInfo(ipcBusClientNodeMain, {
              color: "red",
              message: `Parcel: ${item.ParcelNumber} failed to download`,
            });

            continue;
          }
        } catch (error) {
          arrayOfFailedOperations.push(item);
          await sendFailedIteration(
            ipcBusClientNodeMain,
            item,
            `Parcel: ${item.ParcelNumber} failed to download`
          );
          await sendEventLogInfo(ipcBusClientNodeMain, {
            color: "red",
            message: `Parcel: ${item.ParcelNumber} failed to download`,
          });

          continue;
        }

        /* 
            -----------------------------------------Pull Tax Data Strings--------------------------------
        */

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "blue",
          message: "Pulling Tax Bill data",
        });

        const [installmentTotalString, installmentTotalInt] =
          await pullTaxBillStrings(driver, websiteSelectors, installmentNumber);
        const bblSearchBtn = await awaitElementLocatedAndReturn(
          driver,
          websiteSelectors.bblSearchBtn,
          "xpath"
        );

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "regular",
          message: `Installment as string: ${installmentTotalString}, Installment as integer: ${installmentTotalInt}`,
        });
        await bblSearchBtn.click();
        await driver.wait(
          until.urlContains("search/commonsearch.aspx?mode=persprop")
        );

        await switchToPTaxTab(driver, ptaxWindow);

        // Navigate to parcel in PTax

        await driver.navigate().refresh();
        await swapToIFrameDefaultContent(driver);

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "orange",
          message: `Searching for parcel: ${item.ParcelNumber} in Ptax`,
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
        const propertyToAddTaxBill = await awaitElementLocatedAndReturn(
          driver,
          propertySideBarXPath,
          "xpath"
        );
        await propertyToAddTaxBill.click();
        await driver.sleep(2500);

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "regular",
          message: "Navigating to existing assessment",
        });
        await swapToIFrame1(driver);
        await navigateToExistingAssessment(driver);

        // Fill out the input fields and save

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "purple",
          message: "Performing data entry",
        });
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

        // Reset to default

        await swapToIFrame0(driver);
        await switchToTaxWebsiteTab(driver, taxWebsiteWindow);
        await driver.sleep(5000);

        arrayOfSuccessfulOperations.push(item);
        let itemErrorColRemoved = item;
        if (itemErrorColRemoved?.Error) {
          delete itemErrorColRemoved.Error;
        }
        await sendSuccessfulIteration(
          ipcBusClientNodeMain,
          itemErrorColRemoved
        );
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "green",
          message: `Succeeded for parcel: ${item.ParcelNumber}`,
        });
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

        arrayOfFailedOperations.push(item);
      }
    }

    await printAutomationReportToSheet(
      arrayOfSuccessfulOperations,
      arrayOfFailedOperations,
      "./output/"
    );
    await sendAutomationCompleted(ipcBusClientNodeMain);
    await sendEventLogInfo(ipcBusClientNodeMain, {
      color: "blue",
      message: "The automation is complete.",
    });

    console.log(
      colors.blue.bold(
        `Reports have been generated for parcels that were added successful and unsuccessfuly, located in the output folder. Please check the 'Failed Operations' tab to verify if any results need manual review.`
      ),
      "\n"
    );
    await closingAutomationSystem(driver);
  } catch (error) {
    logErrorMessageCatch(error);
  }
};

module.exports = performDataEntryAndDownload;
