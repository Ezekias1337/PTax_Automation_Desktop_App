// Library Imports
const colors = require("colors");
// Functions, Helpers, Utils
const loginToPtax = require("../../../../../functions/ptax-specific/loginToPtax");
const swapToIFrameDefaultContent = require("../../../../../functions/ptax-specific/frame-swaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../../../../functions/ptax-specific/frame-swaps/swapToIFrame0");
const swapToIFrame1 = require("../../../../../functions/ptax-specific/frame-swaps/swapToIFrame1");
const openNewTab = require("../../../../../functions/tab-swaps-and-handling/openNewTab");
const switchToPTaxTab = require("../../../../../functions/tab-swaps-and-handling/switchToPTaxTab");
const switchToTaxWebsiteTab = require("../../../../../functions/tab-swaps-and-handling/switchToTaxWebsiteTab");
const closingAutomationSystem = require("../../../../../functions/driver/closingAutomationSystem");
const consoleLogLine = require("../../../../../functions/general/consoleLogLine");
const switchToAndDismissAlert = require("../../../../../functions/tab-swaps-and-handling/switchToAndDismissAlert");

const addAssessment = require("../../../cross-state-helpers/addAssessment");
const uploadAssessment = require("../../../cross-state-helpers/uploadAssessment");
const searchForParcel = require("../helpers/searchForParcel");
const pullAssessmentStrings = require("../helpers/pullAssessmentStrings");
const downloadAssessment = require("../helpers/downloadAssessment.js");
const handleGlobalError = require("../../../../../helpers/handleGlobalError");

const generateDynamicXPath = require("../../../../../utils/strings/generateDynamicXPath");
const sendKeysInputFields = require("../../../../../utils/web-elements/sendKeysInputFields");
const awaitElementLocatedAndReturn = require("../../../../../utils/waits/awaitElementLocatedAndReturn");

// Constants
const {
  parcelQuestLoginPage,
  parcelQuestHomePage,
} = require("../../../../../constants/urls");
// Selectors
const {
  assessmentNoticesSelectors,
  searchByParcelNumberSelector,
} = require("../../../../../constants/selectors/allSelectors");

const assessmentWebsiteSelectors = {
  countyInputField: "#QuickSearch_CountyId",
  parcelInputField: "#QuickSearch_ApnId",
  parcelQuestSearchButton: "#Quick > button.btnQuickSearch",
  parcelQuestViewResultsButton: "#resultsView > button",
  noResultsWarning:
    "//span[contains(text(), 'Total found was 0. Please revise your search criteria.')]",

  landMarketValue:
    "body > div.body-content.ng-scope > div > section.panel.panel-secondary.ng-scope.summary > div.panel-body.ng-scope > div > div > div.col-lg-7.info > div.table-responsive.info-section.info-section-taxvalue > table > tbody > tr:nth-child(1) > td:nth-child(2) > span",
  improvementMarketValue:
    "body > div.body-content.ng-scope > div > section.panel.panel-secondary.ng-scope.summary > div.panel-body.ng-scope > div > div > div.col-lg-7.info > div.table-responsive.info-section.info-section-taxvalue > table > tbody > tr:nth-child(2) > td:nth-child(2) > span",
  summary:
    "body > div > div > section.panel.panel-secondary.ng-scope.summary > div.panel-body.ng-scope > div > div > div.col-lg-7.info",
  buildingsLandCharacteristics:
    "body > div.body-content.ng-scope > div > section.panel.panel-secondary.ng-scope.buildingland",
  eventsHistory:
    "body > div.body-content.ng-scope > div > section.panel.panel-secondary.ng-scope.eventshistory",
  assessmentHistory:
    "body > div.body-content.ng-scope > div > section.panel.panel-secondary.ng-scope.assessment",
  paginationElement:
    "body > div.body-content.ng-scope > div > section.panel.panel-secondary.ng-scope.assessment > div.panel-body.ng-scope > div > div:nth-child(3)",
  loader: "//h3[contains(text(), 'Loading')]",
  btnNewAssessment: "Button2",
};
const arrayOfSuccessfulOperations = [];
const arrayOfFailedOperations = [];

const performDataEntryAndDownload = async (
  {
    assessmentYear,
    downloadDirectory,
    ptaxUsername,
    ptaxPassword,
    spreadsheetContents,
  },
  ipcBusClientNodeMain
) => {
  /* 
    ! NEED TO ACCOUNT FOR OTHER RE VALUES WHEN PULLING STRINGS, EXAMPLE PARCEL: 5531-001-001, 5531-001-006
  */

  try {
    const assessmentYearEnd = parseInt(assessmentYear) + 1;
    const { ptaxWindow, driver } = await loginToPtax(
      ptaxUsername,
      ptaxPassword,
      ipcBusClientNodeMain
    );

    await openNewTab(driver);
    await driver.get(parcelQuestLoginPage);
    const taxWebsiteWindow = await driver.getWindowHandle();

    for (const item of spreadsheetContents) {
      try {
        console.log(
          colors.magenta.bold(`Working on parcel: ${item.ParcelNumber}`)
        );
        await switchToAndDismissAlert(driver);
        await driver.get(parcelQuestHomePage);
        await searchForParcel(driver, item, assessmentWebsiteSelectors);

        //Handle error if parcel isn't brough up directly
        let currentUrl = await driver.getCurrentUrl();
        if (currentUrl.includes("/?b=")) {
          arrayOfFailedOperations.push(item);
          continue;
        }

        const fileNameForFile = await downloadAssessment(
          item,
          downloadDirectory,
          driver,
          assessmentWebsiteSelectors
        );

        if (fileNameForFile === null) {
          arrayOfFailedOperations.push(item);
          console.log(
            colors.red.bold(`Failed for parcel: ${item.ParcelNumber}`)
          );
          continue;
        }

        const [landMarketValueString, improvementMarketValueString] =
          await pullAssessmentStrings(driver, assessmentWebsiteSelectors);

        if (
          landMarketValueString === "0" &&
          improvementMarketValueString === "0"
        ) {
          console.log(
            colors.red.bold(
              `Parcel: ${item.ParcelNumber} has 0 value for land and improvements. Skipping...`
            )
          );
          throw Object.assign(
            new Error(
              `Parcel: ${item.ParcelNumber} has 0 value for land and improvements. Skipping...`
            ),
            { code: 402 }
          );
        }

        await switchToPTaxTab(driver, ptaxWindow);
        await driver.navigate().refresh();
        await swapToIFrameDefaultContent(driver);

        const searchByParcelInput = await awaitElementLocatedAndReturn(
          driver,
          searchByParcelNumberSelector,
          "id"
        );
        await sendKeysInputFields(searchByParcelInput, item.ParcelNumber, true);

        await swapToIFrame0(driver);
        let propertySideBarXPath = generateDynamicXPath(
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

        await addAssessment(
          driver,
          assessmentNoticesSelectors,
          assessmentYear,
          landMarketValueString,
          null,
          improvementMarketValueString,
          null
        );
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
        /* const amountToSleep = generateDelayNumber();
        await driver.sleep(amountToSleep); */
        consoleLogLine();
      } catch (error) {
        console.log(colors.red.bold(`Failed for parcel: ${item.ParcelNumber}`));
        console.log(error);
        consoleLogLine();
        arrayOfFailedOperations.push(item);
      }
    }

    await closingAutomationSystem(driver, ipcBusClientNodeMain);
  } catch (error) {
    if (
      error.message ===
      "Cannot destructure property 'driver' of '(intermediate value)' as it is undefined."
    ) {
      await handleGlobalError(
        ipcBusClientNodeMain,
        "Chrome Driver Needs Update"
      );
    } else if (
      error.message.includes("Failed to create Chrome process") || error.message.includes("Chrome failed to start")
    ) {
      await handleGlobalError(ipcBusClientNodeMain, "Chrome Not Installed");
    } else {
      await handleGlobalError(
        ipcBusClientNodeMain,
        "Unknown Error",
        error.message
      );
    }
  }
};

module.exports = performDataEntryAndDownload;
