// Library Imports
const colors = require("colors");
// Functions, Helpers, Utils
const logErrorMessageCatch = require("../../../../../../../functions/general/consoleLogErrors/logErrorMessageCatch");
const loginToPTAX = require("../../../../../../../functions/pTaxSpecific/login/loginToPTAX");
const swapToIFrameDefaultContent = require("../../../../../../../functions/pTaxSpecific/frameSwaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../../../../../../functions/pTaxSpecific/frameSwaps/swapToIFrame0");
const swapToIFrame1 = require("../../../../../../../functions/pTaxSpecific/frameSwaps/swapToIFrame1");
const clickCheckMyPropertiesCheckBox = require("../../../../../../../functions/pTaxSpecific/clickCheckMyPropertiesCheckBox/clickCheckMyPropertiesCheckBox");
const printAutomationReportToSheet = require("../../../../../../../functions/fileOperations/printAutomationReportToSheet");
const openNewTab = require("../../../../../../../functions/tabSwapsAndHandling/openNewTab");
const switchToPTaxTab = require("../../../../../../../functions/tabSwapsAndHandling/switchToPTaxTab");
const switchToTaxWebsiteTab = require("../../../../../../../functions/tabSwapsAndHandling/switchToTaxWebsiteTab");
const awaitElementLocatedAndReturn = require("../../../../../../../functions/general/awaitElementLocatedAndReturn");
const closingAutomationSystem = require("../../../../../../../functions/general/closingAutomationSystem");
const generateDynamicXPath = require("../../../../../../../functions/general/generateDynamicXPath");
const generateDelayNumber = require("../../../../../../../functions/general/generateDelayNumber");
const sendKeysPTaxInputFields = require("../../../../../../../functions/pTaxSpecific/sendKeysPTaxInputFields/sendKeysPTaxInputFields");
const consoleLogLine = require("../../../../../../../functions/general/consoleLogLine");
const switchToAndDismissAlert = require("../../../../../../../functions/tabSwapsAndHandling/switchToAndDismissAlert");

const addAssessment = require("../../../../../cross-state-helpers/addAssessment");
const uploadAssessment = require("../../../../../cross-state-helpers/uploadAssessment");
const searchForParcel = require("../helpers/searchForParcel");
const pullAssessmentStrings = require("../helpers/pullAssessmentStrings");
const downloadAssessment = require("../helpers/downloadAssessment.js");

// Constants
const {
  parcelQuestLoginPage,
  parcelQuestHomePage,
} = require("../../../../../../../constants/urls");
// Selectors
const {
  assessmentNoticesSelectors,
  searchByParcelNumberSelector,
} = require("../../../../../../../ptaxXpathsAndSelectors/allSelectors");

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
    automation,
    assessmentYear,
    downloadDirectory,
    spreadsheetFile,
    state,
    ptaxUsername,
    ptaxPassword,
    parcelQuestUsername,
    parcelQuestPassword,
    county,
    operation,
    spreadsheetContents,
  },
  ipcBusClientNodeMain
) => {
  /* 
    ! NEED TO ACCOUNT FOR OTHER RE VALUES WHEN PULLING STRINGS, EXAMPLE PARCEL: 5531-001-001, 5531-001-006
  */

  try {
    const assessmentYearEnd = parseInt(assessmentYear) + 1;
    const [ptaxWindow, driver] = await loginToPTAX(ptaxUsername, ptaxPassword);

    /* These values will be null if the login failed, this will cause the execution
      to stop */

    if (ptaxWindow === null || driver === null) {
      return;
    }

    await swapToIFrame0(driver);
    await clickCheckMyPropertiesCheckBox(driver);

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
        await sendKeysPTaxInputFields(
          searchByParcelInput,
          item.ParcelNumber,
          true
        );

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
        const amountToSleep = generateDelayNumber();
        await driver.sleep(amountToSleep);
        consoleLogLine();
      } catch (error) {
        console.log(colors.red.bold(`Failed for parcel: ${item.ParcelNumber}`));
        console.log(error);
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
      )
    );
    await closingAutomationSystem(driver);
  } catch (error) {
    logErrorMessageCatch(error);
  }
};

module.exports = performDataEntryAndDownload;
