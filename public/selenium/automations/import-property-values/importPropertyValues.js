// Library Imports
const colors = require("colors");
const { By, until } = require("selenium-webdriver");
// Functions, Helpers, Utils
const loginToPtax = require("../../functions/ptax-specific/loginToPtax");
const closingAutomationSystem = require("../../functions/driver/closingAutomationSystem");
const swapToIFrameDefaultContent = require("../../functions/ptax-specific/frame-swaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../functions/ptax-specific/frame-swaps/swapToIFrame0");
const swapToIFrame1 = require("../../functions/ptax-specific/frame-swaps/swapToIFrame1");
const sendMessageToFrontEnd = require("../../functions/ipc-bus/sendMessage/sendMessageToFrontEnd");

const handleGlobalError = require("../../helpers/handleGlobalError");

const awaitElementLocatedAndReturn = require("../../utils/waits/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../utils/strings/generateDynamicXPath");
const waitForLoading = require("../../functions/ptax-specific/waitForLoading");
const sendKeysInputFields = require("../../utils/web-elements/sendKeysInputFields");
const scrollElementIntoView = require("../../utils/web-elements/scrollElementIntoView");

// Selectors
const {
  searchByParcelNumberSelector,
  assessmentNoticesSelectors,
} = require("../../constants/selectors/allSelectors");

const importPropertyValues = async (
  { ptaxUsername, ptaxPassword, spreadsheetContents, assessmentYear },
  ipcBusClientNodeMain
) => {
  const importPropertyValuesSelectors = {
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
    startAssessmentBtn: "btnStart",
    taxYearNewAssessmentDropdown: "ddTaxYear",
  };

  const arrayOfSuccessfulOperations = [];
  const arrayOfFailedOperations = [];

  try {
    console.log(`Running add new parcel automation: `);

    const { driver } = await loginToPtax(
      ptaxUsername,
      ptaxPassword,
      ipcBusClientNodeMain
    );

    for (const item of spreadsheetContents) {
      try {
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Current Iteration", {
          primaryMessage: item.ParcelNumber,
        });
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Working on parcel: ${item.ParcelNumber}`,
          messageColor: "regular",
        });

        await swapToIFrameDefaultContent(driver);
        const searchByParcelNumberInput = await awaitElementLocatedAndReturn(
          driver,
          searchByParcelNumberSelector,
          "id"
        );
        await sendKeysInputFields(
          searchByParcelNumberInput,
          item.ParcelNumber,
          true
        );
        await swapToIFrame0(driver);

        const propertySideBarXPath = generateDynamicXPath(
          "a",
          item.ParcelNumber,
          "contains"
        );
        const parcelToImportValues = await awaitElementLocatedAndReturn(
          driver,
          propertySideBarXPath,
          "xpath"
        );
        await parcelToImportValues.click();
        await driver.sleep(2500);

        // Do data entry for adding parcel, and then save
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "", {
          primaryMessage: "Performing data entry...",
          messageColor: "yellow",
          errorMessage: null,
        });

        /*
         ***************************************************************
         */

        await swapToIFrame1(driver);

        const btnNewAssessment = await awaitElementLocatedAndReturn(
          driver,
          importPropertyValuesSelectors.btnNewAssessment,
          "id"
        );
        await btnNewAssessment.click();

        const taxYearNewAssessmentDropdown = await awaitElementLocatedAndReturn(
          driver,
          importPropertyValuesSelectors.taxYearNewAssessmentDropdown,
          "id"
        );
        const taxYearNewAssessmentXPath = generateDynamicXPath(
          "option",
          assessmentYear,
          "equals"
        );
        const taxYearForDropdown =
          await taxYearNewAssessmentDropdown.findElement(
            By.xpath(taxYearNewAssessmentXPath)
          );
        await taxYearForDropdown.click();

        const startAssessmentBtn = await awaitElementLocatedAndReturn(
          driver,
          importPropertyValuesSelectors.startAssessmentBtn,
          "id"
        );
        await startAssessmentBtn.click();
        await driver.wait(
          until.elementLocated(
            By.id(assessmentNoticesSelectors.assessmentSection)
          )
        );

        const landMarketValueInputField = await awaitElementLocatedAndReturn(
          driver,
          assessmentNoticesSelectors.landMarketValueInput,
          "name"
        );
        await landMarketValueInputField.sendKeys(item.MarketValue);

        const landAssessedValueInputField = await awaitElementLocatedAndReturn(
          driver,
          assessmentNoticesSelectors.landAssessedValueInput,
          "name"
        );
        await landAssessedValueInputField.sendKeys(item.MarketValue);

        const improvementsMarketValueInputField =
          await awaitElementLocatedAndReturn(
            driver,
            assessmentNoticesSelectors.improvementsMarketValueInput,
            "name"
          );
        await improvementsMarketValueInputField.sendKeys(item.AssessedValue);

        const improvementAssessedValueInputField =
          await awaitElementLocatedAndReturn(
            driver,
            assessmentNoticesSelectors.improvementsAssessedValueInput,
            "name"
          );

        await improvementAssessedValueInputField.sendKeys(item.AssessedValue);

        const btnSaveAssessment = await awaitElementLocatedAndReturn(
          driver,
          assessmentNoticesSelectors.btnSaveAssessment,
          "name"
        );
        await scrollElementIntoView(driver, btnSaveAssessment);
        await btnSaveAssessment.click();
        await waitForLoading(driver);

        /*
         ***************************************************************
         */

        let itemErrorColRemoved = item;
        if (itemErrorColRemoved?.Error) {
          delete itemErrorColRemoved.Error;
        }

        await sendMessageToFrontEnd(
          ipcBusClientNodeMain,
          "Successful Iteration",
          {
            primaryMessage: itemErrorColRemoved,
          }
        );
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Succeeded for parcel: ${item.ParcelNumber}`,
          messageColor: "green",
        });
      } catch (error) {
        console.log(colors.red.bold(`Failed for parcel: ${item.ParcelNumber}`));
        console.log(error);

        arrayOfFailedOperations.push(item);

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Failed Iteration", {
          primaryMessage: item,
          errorMessage: error,
        });
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Failed for parcel: ${item.ParcelNumber}`,
          messageColor: "red",
        });
      }
    }

    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Automation Completed");
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "The automation is complete.",
      messageColor: "regular",
    });
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

module.exports = importPropertyValues;
