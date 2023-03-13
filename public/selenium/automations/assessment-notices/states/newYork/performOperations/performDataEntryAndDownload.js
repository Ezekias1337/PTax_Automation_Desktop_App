// Library Imports
const colors = require("colors");
// Functions, Helpers, Utils
const logErrorMessageCatch = require("../../../../../functions/general/logErrorMessageCatch");
const loginToPtax = require("../../../../../functions/ptax-specific/loginToPtax");
const swapToIFrameDefaultContent = require("../../../../../functions/ptax-specific/frame-swaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../../../../functions/ptax-specific/frame-swaps/swapToIFrame0");
const swapToIFrame1 = require("../../../../../functions/ptax-specific/frame-swaps/swapToIFrame1");
const openNewTab = require("../../../../../functions/tab-swaps-and-handling/openNewTab");
const switchToPTaxTab = require("../../../../../functions/tab-swaps-and-handling/switchToPTaxTab");
const switchToTaxWebsiteTab = require("../../../../../functions/tab-swaps-and-handling/switchToTaxWebsiteTab");
const awaitElementLocatedAndReturn = require("../../../../../utils/waits/awaitElementLocatedAndReturn");
const closingAutomationSystem = require("../../../../../functions/driver/closingAutomationSystem");
const generateDynamicXPath = require("../../../../../utils/strings/generateDynamicXPath");
const sendKeysInputFields = require("../../../../../utils/web-elements/sendKeysInputFields");
const consoleLogLine = require("../../../../../functions/general/consoleLogLine");

const addAssessment = require("../../../cross-state-helpers/addAssessment");
const uploadAssessment = require("../../../cross-state-helpers/uploadAssessment");
const bblSearch = require("../helpers/bblSearch");
const checkIfNoResultsOrMultipleResults = require("../helpers/checkIfNoResultsOrMultipleResults");
const checkIfSessionExpired = require("../helpers/checkIfSessionExpired");
const checkIfWebsiteUnderMaintenance = require("../helpers/checkIfWebsiteUnderMaintenance");
const downloadAssessment = require("../helpers/downloadAssessment");
const pullAssessmentStrings = require("../helpers/pullAssessmentStrings");

const sendMessageToFrontEnd = require("../../../../../functions/ipc-bus/sendMessage/sendMessageToFrontEnd");
// Constants
const { nyTaxBillSite } = require("../../../../../constants/urls");
// Selectors
const {
  assessmentNoticesSelectors,
  searchByParcelNumberSelector,
} = require("../../../../../constants/selectors/allSelectors");

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

    const { ptaxWindow, driver } = await loginToPtax(
      ptaxUsername,
      ptaxPassword,
      ipcBusClientNodeMain
    );

    await openNewTab(driver);
    await driver.get(nyTaxBillSite);
    const taxWebsiteWindow = await driver.getWindowHandle();

    const maintenanceStatus = await checkIfWebsiteUnderMaintenance(
      driver,
      ipcBusClientNodeMain
    );
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
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Current Iteration", {
          primaryMessage: item.ParcelNumber,
          messageColor: null,
          errorMessage: null,
        });
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Working on parcel: ${item.ParcelNumber}`,
          messageColor: "regular",
          errorMessage: null,
        });

        await checkIfSessionExpired(driver, assessmentWebsiteSelectors);

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Searching for parcel: ${item.ParcelNumber}`,
          messageColor: "orange",
          errorMessage: null,
        });
        await bblSearch(driver, item, assessmentWebsiteSelectors);

        const resultsNotPresent = await checkIfNoResultsOrMultipleResults(
          driver,
          item,
          assessmentWebsiteSelectors
        );

        if (resultsNotPresent === true) {
          arrayOfFailedOperations.push(item);

          await sendMessageToFrontEnd(
            ipcBusClientNodeMain,
            "Failed Iteration",
            {
              primaryMessage: item.ParcelNumber,
              messageColor: null,
              errorMessage: `Failed to find parcel: ${item.ParcelNumber} in database.`,
            }
          );

          await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
            primaryMessage: `Failed to find parcel: ${item.ParcelNumber} in database.`,
            messageColor: "red",
            errorMessage: null,
          });

          continue;
        }

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Downloading Assessment for: ${item.ParcelNumber}`,
          messageColor: "blue",
          errorMessage: null,
        });

        const fileNameForFile = await downloadAssessment(
          driver,
          item,
          assessmentWebsiteSelectors,
          downloadDirectory,
          assessmentYear,
          arrayOfFailedOperations
        );

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Download successful`,
          messageColor: "purple",
          errorMessage: null,
        });

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

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: "Resetting tax site window for next search...",
          messageColor: "orange",
          errorMessage: null,
        });

        await driver.navigate().back();
        await driver.navigate().back();
        await driver.navigate().back();

        await switchToPTaxTab(driver, ptaxWindow);
        await driver.navigate().refresh();
        await swapToIFrameDefaultContent(driver);
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Searching for: ${item.ParcelNumber} in Ptax`,
          messageColor: "orange",
          errorMessage: null,
        });

        const searchByParcelInput = await awaitElementLocatedAndReturn(
          driver,
          searchByParcelNumberSelector,
          "id"
        );
        await sendKeysInputFields(searchByParcelInput, item.ParcelNumber, true);

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

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: "Performing data entry...",
          messageColor: "yellow",
          errorMessage: null,
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

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: "Uploading Assessment PDF...",
          messageColor: "yellow",
          errorMessage: null,
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

        await sendMessageToFrontEnd(
          ipcBusClientNodeMain,
          "Successful Iteration",
          {
            primaryMessage: itemErrorColRemoved,
            messageColor: null,
            errorMessage: null,
          }
        );
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Succeeded for parcel: ${item.ParcelNumber}`,
          messageColor: "green",
          errorMessage: null,
        });

        /* const amountToSleep = generateDelayNumber();
        await driver.sleep(amountToSleep); */
        consoleLogLine();
      } catch (error) {
        console.log(colors.red.bold(`Failed for parcel: ${item.ParcelNumber}`));
        console.log(error);
        consoleLogLine();
        arrayOfFailedOperations.push(item);

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Failed Iteration", {
          primaryMessage: item,
          messageColor: null,
          errorMessage: `Failed to find parcel: ${item.ParcelNumber} in database.`,
        });
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Failed for parcel: ${item.ParcelNumber}`,
          messageColor: "red",
          errorMessage: null,
        });
      }
    }

    await sendMessageToFrontEnd(
      ipcBusClientNodeMain,
      "Automation Completed",
      {}
    );
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "The automation is complete.",
      messageColor: "regular",
      errorMessage: null,
    });

    await closingAutomationSystem(driver, ipcBusClientNodeMain);
  } catch (error) {
    logErrorMessageCatch(error);
  }
};

module.exports = performDataEntryAndDownload;
