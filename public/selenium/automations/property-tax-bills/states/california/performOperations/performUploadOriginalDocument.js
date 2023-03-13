// Functions, Helpers, Utils
const logErrorMessageCatch = require("../../../../../functions/general/logErrorMessageCatch");
const closingAutomationSystem = require("../../../../../functions/driver/closingAutomationSystem");
const loginToPtax = require("../../../../../functions/ptax-specific/loginToPtax");
const swapToIFrameDefaultContent = require("../../../../../functions/ptax-specific/frame-swaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../../../../functions/ptax-specific/frame-swaps/swapToIFrame0");
const swapToIFrame1 = require("../../../../../functions/ptax-specific/frame-swaps/swapToIFrame1");
const navigateToExistingAssessment = require("../../../../../functions/ptax-specific/navigateToExistingAssessment");
const waitForLoading = require("../../../../../functions/ptax-specific/waitForLoading");
const sendMessageToFrontEnd = require("../../../../../functions/ipc-bus/sendMessage/sendMessageToFrontEnd");

const uploadTaxBill = require("../../../cross-state-helpers/uploadTaxBill");

const selectDropdownElement = require("../../../../../utils/web-elements/selectDropdownElement");
const awaitElementLocatedAndReturn = require("../../../../../utils/waits/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../../../../utils/strings/generateDynamicXPath");
const sendKeysInputFields = require("../../../../../utils/web-elements/sendKeysInputFields");
const scrollElementIntoView = require("../../../../../utils/web-elements/scrollElementIntoView");
const {
  replaceSpacesWithUnderscore,
} = require("../../../../../../shared/utils/strings/replaceSpacesWithUnderscore");

// Selectors
const {
  searchByParcelNumberSelector,
  taxBillSelectors,
} = require("../../../../../constants/selectors/allSelectors");

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

    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "Logging into Ptax",
      messageColor: "regular",
      errorMessage: null,
    });
    const { driver } = await loginToPtax(
      ptaxUsername,
      ptaxPassword,
      ipcBusClientNodeMain
    );

    for (const item of spreadsheetContents) {
      try {
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Working on Parcel Number: ${item.ParcelNumber}`,
          messageColor: "regular",
          errorMessage: null,
        });
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Current Iteration", {
          primaryMessage: item.ParcelNumber,
          messageColor: null,
          errorMessage: null,
        });

        await driver.navigate().refresh();

        /* 
          Navigate to parcel in PTax
        */

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
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: "Navigating to existing assessment",
          messageColor: "orange",
          errorMessage: null,
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

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Performing Data Entry for: ${item.ParcelNumber}`,
          messageColor: "yellow",
          errorMessage: null,
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

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Uploading Bill for: ${item.ParcelNumber}`,
          messageColor: "yellow",
          errorMessage: null,
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
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Bill successfully uploaded for: ${item.ParcelNumber}`,
          messageColor: "regular",
          errorMessage: null,
        });
        await driver.sleep(2500);
        await swapToIFrame0(driver);

        arrayOfSuccessfulOperations.push(item);
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
      } catch (error) {
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Failed Iteration", {
          primaryMessage: item,
          messageColor: null,
          errorMessage: error.message,
        });
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Failed for parcel: ${item.ParcelNumber} || ${error.message}`,
          messageColor: "red",
          errorMessage: null,
        });

        await driver.navigate().refresh();
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

module.exports = performUploadOriginalDocument;
