const colors = require("colors");
const { By, until } = require("selenium-webdriver");
const promptLogin = require("../../functions/userPrompts/individual/promptLogin");
const loginToPTAX = require("../../functions/pTaxSpecific/login/loginToPTAX");
const readSpreadsheetFile = require("../../functions/fileOperations/readSpreadsheetFile");
const closingAutomationSystem = require("../../functions/general/closingAutomationSystem");
const clickOnSelectOption = require("../../functions/general/clickOnSelectOption");
const simulateMouseHover = require("../../functions/general/simulateMouseHover");
const swapToIFrameDefaultContent = require("../../functions/pTaxSpecific/frameSwaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../functions/pTaxSpecific/frameSwaps/swapToIFrame0");
const swapToIFrame1 = require("../../functions/pTaxSpecific/frameSwaps/swapToIFrame1");
const clickCheckMyPropertiesCheckBox = require("../../functions/pTaxSpecific/clickCheckMyPropertiesCheckBox/clickCheckMyPropertiesCheckBox");
const logErrorMessageCatch = require("../../functions/general/consoleLogErrors/logErrorMessageCatch");
const verifySpreadSheetColumnNames = require("../../functions/fileOperations/verifySpreadSheetColumnNames");
const handleColumnNameLogging = require("../../functions/fileOperations/handleColumnNameLogging");
const awaitElementLocatedAndReturn = require("../../functions/general/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../functions/general/generateDynamicXPath");
const printAutomationReportToSheet = require("../../functions/fileOperations/printAutomationReportToSheet");
const waitForLoading = require("../../functions/pTaxSpecific/waitForLoading/waitForLoading");
const {
  searchByLocationSelector,
  navbarEditSelectors,
  addNewParcelsSelectors,
  newParcelHeader,
  searchByParcelNumberSelector,
} = require("../../ptaxXpathsAndSelectors/allSelectors");
const sendKeysPTaxInputFields = require("../../functions/pTaxSpecific/sendKeysPTaxInputFields/sendKeysPTaxInputFields");
const clickNavbarMenu = require("../../functions/pTaxSpecific/clickNavbar/clickNavbarMenu");
const assessmentNoticesSelectors = require("../../ptaxXpathsAndSelectors/assessmentNoticesSelectors/assessmentNoticesSelectors");

const sendCurrentIterationInfo = require("../../ipc-bus/sendCurrentIterationInfo");
const sendSuccessfulIteration = require("../../ipc-bus/sendSuccessfulIteration");
const sendFailedIteration = require("../../ipc-bus/sendFailedIteration");
const sendEventLogInfo = require("../../ipc-bus/sendEventLogInfo");
const sendAutomationCompleted = require("../../ipc-bus/sendAutomationCompleted");
const handleAutomationCancel = require("../../ipc-bus/handleAutomationCancel");
const scrollElementIntoView = require("../../functions/general/scrollElementIntoView");

const importPropertyValues = async (
  {
    downloadDirectory,
    ptaxUsername,
    ptaxPassword,
    spreadsheetContents,
    assessmentYear,
  },
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
        await sendCurrentIterationInfo(ipcBusClientNodeMain, item.ParcelNumber);
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "orange",
          message: `Working on parcel: ${item.ParcelNumber}`,
        });

        await swapToIFrameDefaultContent(driver);
        const searchByParcelNumberInput = await awaitElementLocatedAndReturn(
          driver,
          searchByParcelNumberSelector,
          "id"
        );
        await sendKeysPTaxInputFields(
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
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "orange",
          message: `Performing data entry...`,
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

        await sendSuccessfulIteration(
          ipcBusClientNodeMain,
          itemErrorColRemoved
        );
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "green",
          message: `Succeeded for parcel: ${item.ParcelNumber}`,
        });
      } catch (error) {
        console.log(colors.red.bold(`Failed for parcel: ${item.ParcelNumber}`));
        console.log(error);

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

module.exports = importPropertyValues;
