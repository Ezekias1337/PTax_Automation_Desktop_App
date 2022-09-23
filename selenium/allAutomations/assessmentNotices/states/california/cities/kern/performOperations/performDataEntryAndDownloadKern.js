const colors = require("colors");
const verifySpreadSheetColumnNames = require("../../../../../../../functions/fileOperations/verifySpreadSheetColumnNames");
const handleColumnNameLogging = require("../../../../../../../functions/fileOperations/handleColumnNameLogging");
const readSpreadsheetFile = require("../../../../../../../functions/fileOperations/readSpreadsheetFile");
const logErrorMessageCatch = require("../../../../../../../functions/general/consoleLogErrors/logErrorMessageCatch");
const promptLogin = require("../../../../../../../functions/userPrompts/individual/promptLogin");
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
const promptForYear = require("../../../../../../../functions/userPrompts/individual/promptForYear");
const promptOutputDirectory = require("../../../../../../../functions/userPrompts/individual/promptOutputDirectory");
const generateDelayNumber = require("../../../../../../../functions/general/generateDelayNumber");
const sendKeysPTaxInputFields = require("../../../../../../../functions/pTaxSpecific/sendKeysPTaxInputFields/sendKeysPTaxInputFields");
const { kernAssessmentSite } = require("../../../../../../../constants/urls");
const {
  downloadAndDataEntryAssessmentNoticesColumns,
} = require("../../../../../../../dataValidation/spreadsheetColumns/allSpreadSheetColumns");
const {
  assessmentNoticesSelectors,
  searchByParcelNumberSelector,
} = require("../../../../../../../ptaxXpathsAndSelectors/allSelectors");
const consoleLogLine = require("../../../../../../../functions/general/consoleLogLine");
const addAssessment = require("../../../../../cross-state-helpers/addAssessment");
const searchForParcel = require("../helpers/searchForParcel");
const pullAssessmentStrings = require("../helpers/pullAssessmentStrings");
const uploadAssessment = require("../../../../../cross-state-helpers/uploadAssessment");
const downloadAssessment = require("../helpers/downloadAssessment.js");
const fluentWait = require("../../../../../../../functions/general/fluentWait");
const failedToHandleParcel = require("../../../../../../../functions/general/consoleLogErrors/failedToHandleParcel");
const switchToTaxWebsiteIframe = require("../../../../../../../functions/tabSwapsAndHandling/switchToTaxWebsiteIframe");
const pressNewSearch = require("../helpers/pressNewSearch");

const assessmentWebsiteSelectors = {
  searchBar: "#txtSearchText",
  searchByAPN: "//option[contains(text(), 'APN')]",
  contentFrame: "#contentFrame",
  tableForScraping: "#framedPageDiv > table",
  confirmIsTaxTable:
    "//b[contains(text(), 'Current tax roll values that are used')]",
  landMarketValue: "//td[contains(text(), 'Land Value')]",
  improvementMarketValue: "//td[contains(text(), 'Improvement Value')]",
  newSearch: "a#lnkNewSearch",
  btnNewAssessment: "Button2",
  divForScreenshot: "#framedPageDiv",
  generalPropertyInfoTable:
    "//b[contains(text(), 'General Property Information')]",
};
const arrayOfSuccessfulOperations = [];
const arrayOfFailedOperations = [];

const performDataEntryAndDownload = async () => {
  try {
    console.log(`Running download Tax Bill automation: `);

    const dataFromSpreadsheet = await readSpreadsheetFile();
    const outputDirectory = await promptOutputDirectory();

    const assessmentYear = await promptForYear();
    const assessmentYearEnd = parseInt(assessmentYear) + 1;

    const [areCorrectSheetColumnsPresent, arrayOfMissingColumnNames] =
      verifySpreadSheetColumnNames(
        downloadAndDataEntryAssessmentNoticesColumns,
        dataFromSpreadsheet[0]
      );

    await handleColumnNameLogging(
      areCorrectSheetColumnsPresent,
      arrayOfMissingColumnNames
    );
    if (areCorrectSheetColumnsPresent === false) {
      return;
    }

    const { username, password } = await promptLogin();
    const [ptaxWindow, driver] = await loginToPTAX(username, password);

    /* These values will be null if the login failed, this will cause the execution
      to stop */

    if (ptaxWindow === null || driver === null) {
      return;
    }

    await swapToIFrame0(driver);
    await clickCheckMyPropertiesCheckBox(driver);

    await openNewTab(driver);
    await driver.get(kernAssessmentSite);
    const taxWebsiteWindow = await driver.getWindowHandle();

    for (const item of dataFromSpreadsheet) {
      try {
        console.log(
          colors.magenta.bold(`Working on parcel: ${item.ParcelNumber}`)
        );
        await switchToTaxWebsiteIframe(
          driver,
          assessmentWebsiteSelectors.contentFrame,
          "css"
        );
        await searchForParcel(driver, item, assessmentWebsiteSelectors);

        //Handle error if parcel isn't brough up directly
        let parcelFoundSuccessfully = await fluentWait(
          driver,
          assessmentWebsiteSelectors.generalPropertyInfoTable,
          "xpath",
          10,
          2
        );
        if (parcelFoundSuccessfully === false) {
          failedToHandleParcel(arrayOfFailedOperations, item);
          continue;
        }

        const fileNameForFile = await downloadAssessment(
          item,
          outputDirectory,
          driver,
          assessmentWebsiteSelectors
        );

        if (fileNameForFile === null) {
          failedToHandleParcel(arrayOfFailedOperations, item);
          continue;
        }

        const [landMarketValueString, improvementMarketValueString] =
          await pullAssessmentStrings(driver, assessmentWebsiteSelectors);

        await pressNewSearch(driver, assessmentWebsiteSelectors);

        if (
          landMarketValueString === "0" &&
          improvementMarketValueString === "0"
        ) {
          console.log(
            colors.red.bold(
              `Parcel: ${item.ParcelNumber} has 0 value for land and improvements. Skipping...`
            )
          );
          throw "Value === 0";
        }

        await switchToPTaxTab(driver, ptaxWindow);
        await driver.navigate().refresh();
        await swapToIFrameDefaultContent(driver);

        let searchByParcelInput = await awaitElementLocatedAndReturn(
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
        propertySideBarXPath = generateDynamicXPath(
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
          outputDirectory
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
        failedToHandleParcel(arrayOfFailedOperations, item);
        console.log(error);
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
    await closingAutomationSystem();
  } catch (error) {
    logErrorMessageCatch(error);
  }
};

module.exports = performDataEntryAndDownload;
