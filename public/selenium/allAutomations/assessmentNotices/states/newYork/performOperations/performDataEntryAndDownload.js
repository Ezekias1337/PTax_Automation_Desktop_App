// Library Imports
const colors = require("colors");
// Functions, Helpers, Utils
const logErrorMessageCatch = require("../../../../../functions/general/consoleLogErrors/logErrorMessageCatch");
const loginToPTAX = require("../../../../../functions/pTaxSpecific/login/loginToPTAX");
const swapToIFrameDefaultContent = require("../../../../../functions/pTaxSpecific/frameSwaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../../../../functions/pTaxSpecific/frameSwaps/swapToIFrame0");
const swapToIFrame1 = require("../../../../../functions/pTaxSpecific/frameSwaps/swapToIFrame1");
const clickCheckMyPropertiesCheckBox = require("../../../../../functions/pTaxSpecific/clickCheckMyPropertiesCheckBox/clickCheckMyPropertiesCheckBox");
const openNewTab = require("../../../../../functions/tabSwapsAndHandling/openNewTab");
const switchToPTaxTab = require("../../../../../functions/tabSwapsAndHandling/switchToPTaxTab");
const switchToTaxWebsiteTab = require("../../../../../functions/tabSwapsAndHandling/switchToTaxWebsiteTab");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");
const closingAutomationSystem = require("../../../../../functions/general/closingAutomationSystem");
const generateDynamicXPath = require("../../../../../functions/general/generateDynamicXPath");
const generateDelayNumber = require("../../../../../functions/general/generateDelayNumber");
const sendKeysPTaxInputFields = require("../../../../../functions/pTaxSpecific/sendKeysPTaxInputFields/sendKeysPTaxInputFields");
const consoleLogLine = require("../../../../../functions/general/consoleLogLine");

const addAssessment = require("../../../cross-state-helpers/addAssessment");
const uploadAssessment = require("../../../cross-state-helpers/uploadAssessment");
const bblSearch = require("../helpers/bblSearch");
const checkIfNoResultsOrMultipleResults = require("../helpers/checkIfNoResultsOrMultipleResults");
const checkIfSessionExpired = require("../helpers/checkIfSessionExpired");
const checkIfWebsiteUnderMaintenance = require("../helpers/checkIfWebsiteUnderMaintenance");
const downloadAssessment = require("../helpers/downloadAssessment");
const pullAssessmentStrings = require("../helpers/pullAssessmentStrings");

const sendCurrentIterationInfo = require("../../../../../ipc-bus/sendCurrentIterationInfo");
const sendSuccessfulIteration = require("../../../../../ipc-bus/sendSuccessfulIteration");
const sendFailedIteration = require("../../../../../ipc-bus/sendFailedIteration");
const sendEventLogInfo = require("../../../../../ipc-bus/sendEventLogInfo");
const sendAutomationCompleted = require("../../../../../ipc-bus/sendAutomationCompleted");
const handleAutomationCancel = require("../../../../../ipc-bus/handleAutomationCancel");
// Constants
const { nyTaxBillSite } = require("../../../../../constants/urls");
// Selectors
const {
  assessmentNoticesSelectors,
  searchByParcelNumberSelector,
} = require("../../../../../ptaxXpathsAndSelectors/allSelectors");

const assessmentWebsiteSelectors = {
  agreeBtn: "btAgree",
  burough1:
    "/html/body/div/div[3]/section/div/form/table/tbody/tr/td/div/div/table[1]/tbody/tr[6]/td/table/tbody/tr[1]/td[2]/select/option[2]",
  burough2:
    "/html/body/div/div[3]/section/div/form/table/tbody/tr/td/div/div/table[1]/tbody/tr[6]/td/table/tbody/tr[1]/td[2]/select/option[3]",
  burough3:
    "/html/body/div/div[3]/section/div/form/table/tbody/tr/td/div/div/table[1]/tbody/tr[6]/td/table/tbody/tr[1]/td[2]/select/option[4]",
  burough4:
    "/html/body/div/div[3]/section/div/form/table/tbody/tr/td/div/div/table[1]/tbody/tr[6]/td/table/tbody/tr[1]/td[2]/select/option[5]",
  burough5:
    "/html/body/div/div[3]/section/div/form/table/tbody/tr/td/div/div/table[1]/tbody/tr[6]/td/table/tbody/tr[1]/td[2]/select/option[6]",
  blockInputField: "inpTag",
  lotInputField: "inpStat",
  searchButton: "btSearch",
  noParcelResultsFoundWarner:
    "//p[contains(text(), 'Your search did not find any records.')]",
  websiteMaintenanceWarner: `//b[contains(text(), 'We are currently conducting maintenance')]`,
  sideMenuTab: "sidemenu",
  noticesOfPropertyValueTab: `//span[contains(text(), 'Notices of Property Value')]`,
  noticesOfPropertyValueTable: "datalet_div_1",
  bblSearchBtn: "//span[contains(text(), 'BBL Search')]",
  assessmentInformation: "Assessment Information",
};

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
    console.log(`Running download Tax Bill automation: `);

    const assessmentYearEnd = parseInt(assessmentYear) + 1;

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

    await openNewTab(driver);
    await driver.get(nyTaxBillSite);
    const taxWebsiteWindow = await driver.getWindowHandle();

    const maintenanceStatus = await checkIfWebsiteUnderMaintenance(driver);
    if (maintenanceStatus === true) {
      throw new Error("Website Under Maintenance");
    }

    const agreeBtnElement = await awaitElementLocatedAndReturn(
      driver,
      assessmentWebsiteSelectors.agreeBtn,
      "id"
    );
    await agreeBtnElement.click();

    for (const item of spreadsheetContents) {
      try {
        console.log(
          colors.magenta.bold(`Working on parcel: ${item.ParcelNumber}`)
        );
        await sendCurrentIterationInfo(ipcBusClientNodeMain, item.ParcelNumber);
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "orange",
          message: `Working on parcel: ${item.ParcelNumber}`,
        });

        await checkIfSessionExpired(driver, assessmentWebsiteSelectors);
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "orange",
          message: `Searching for parcel: ${item.ParcelNumber}`,
        });
        await bblSearch(driver, item, assessmentWebsiteSelectors);

        const resultsNotPresent = await checkIfNoResultsOrMultipleResults(
          driver,
          item,
          assessmentWebsiteSelectors
        );

        if (resultsNotPresent === true) {
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

          continue;
        }

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "purple",
          message: `Downloading Assessment for: ${item.ParcelNumber}`,
        });
        const fileNameForFile = await downloadAssessment(
          driver,
          item,
          assessmentWebsiteSelectors,
          downloadDirectory,
          assessmentYear,
          arrayOfFailedOperations
        );

        const [
          landMarketValueString,
          landAssessedValueString,
          improvementMarketValueString,
          improvementAssessedValueString,
        ] = await pullAssessmentStrings(
          driver,
          assessmentWebsiteSelectors,
          assessmentYear,
          assessmentYearEnd
        );

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "yellow",
          message: `Resetting tax site window for next search: ${item.ParcelNumber}`,
        });
        await driver.navigate().back();
        await driver.navigate().back();
        await driver.navigate().back();

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
        const propertyToAddAssessment = await awaitElementLocatedAndReturn(
          driver,
          propertySideBarXPath,
          "xpath"
        );
        await propertyToAddAssessment.click();
        await driver.sleep(2500);

        await swapToIFrame1(driver);

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "orange",
          message: `Performing data entry...`,
        });
        await addAssessment(
          driver,
          assessmentNoticesSelectors,
          assessmentYear,
          landMarketValueString,
          landAssessedValueString,
          improvementMarketValueString,
          improvementAssessedValueString
        );

        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "yellow",
          message: `Uploading Assessment PDF...`,
        });
        await uploadAssessment(
          driver,
          fileNameForFile,
          assessmentYear,
          assessmentYearEnd,
          downloadDirectory
        );
        await switchToTaxWebsiteTab(driver, taxWebsiteWindow);

        arrayOfSuccessfulOperations.push(item);
        console.log(
          colors.green.bold(`Succeeded for parcel: ${item.ParcelNumber}`)
        );

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
        const amountToSleep = generateDelayNumber();
        await driver.sleep(amountToSleep);
        consoleLogLine();
      } catch (error) {
        console.log(colors.red.bold(`Failed for parcel: ${item.ParcelNumber}`));
        console.log(error);
        consoleLogLine();
        arrayOfFailedOperations.push(item);
        await sendFailedIteration(
          ipcBusClientNodeMain,
          item,
          `Failed to find parcel: ${item.ParcelNumber} in database.`
        );
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "red",
          message: `Failed for parcel: ${item.ParcelNumber}`,
        });
      }
    }

    /* await printAutomationReportToSheet(
      arrayOfSuccessfulOperations,
      arrayOfFailedOperations,
      "./output/"
    ); */
    await sendAutomationCompleted(ipcBusClientNodeMain);
    await sendEventLogInfo(ipcBusClientNodeMain, {
      color: "blue",
      message: "The automation is complete.",
    });

    console.log(
      colors.blue.bold(
        `Reports have been generated for parcels that were added successful and unsuccessfuly, located in the output folder. Please check the 'Failed Operations' tab to verify if any results need manual review.`
      )
    );
    await closingAutomationSystem(driver);
  } catch (error) {
    logErrorMessageCatch(error);
  }
};

module.exports = performDataEntryAndDownload;
