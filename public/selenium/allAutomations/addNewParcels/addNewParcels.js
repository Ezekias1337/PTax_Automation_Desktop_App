const colors = require("colors");
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
const {
  searchByLocationSelector,
  navbarEditSelectors,
  addNewParcelsSelectors,
  newParcelHeader,
} = require("../../ptaxXpathsAndSelectors/allSelectors");
const sendKeysPTaxInputFields = require("../../functions/pTaxSpecific/sendKeysPTaxInputFields/sendKeysPTaxInputFields");
const clickNavbarMenu = require("../../functions/pTaxSpecific/clickNavbar/clickNavbarMenu");
const {
  addNewParcelsColumns,
} = require("../../dataValidation/spreadsheetColumns/allSpreadSheetColumns");

const addNewParcels = async () => {
  const arrayOfSuccessfulOperations = [];
  const arrayOfFailedOperations = [];

  try {
    console.log(`Running add new parcel automation: `);

    const dataFromSpreadsheet = await readSpreadsheetFile();
    console.log(
      colors.bold.red(
        "Warning: ensure the words in the Service Level column all begin with a capitalized letter."
      )
    );
    const [areCorrectSheetColumnsPresent, arrayOfMissingColumnNames] =
      verifySpreadSheetColumnNames(
        addNewParcelsColumns,
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

    for (const item of dataFromSpreadsheet) {
      try {
        await swapToIFrameDefaultContent(driver);
        const searchByLocationInput = await awaitElementLocatedAndReturn(
          driver,
          searchByLocationSelector,
          "id"
        );
        await sendKeysPTaxInputFields(
          searchByLocationInput,
          item.Location,
          true
        );
        await swapToIFrame0(driver);

        propertySideBarXPath = generateDynamicXPath(
          "a",
          item.Location,
          "contains"
        );
        const propertyToAddParcel = await awaitElementLocatedAndReturn(
          driver,
          propertySideBarXPath,
          "xpath"
        );
        await propertyToAddParcel.click();
        await driver.sleep(2500);

        await clickNavbarMenu(driver, "edit", navbarEditSelectors.newParcel);
        await swapToIFrame1(driver);

        // Need to simulate mousehover over this element to dismiss navbar
        const parcelInformationH1 = await awaitElementLocatedAndReturn(
          driver,
          newParcelHeader,
          "css"
        );
        await simulateMouseHover(driver, parcelInformationH1);

        // Do data entry for adding parcel, and then save

        const parcelInput = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.parcel,
          "id"
        );
        await sendKeysPTaxInputFields(parcelInput, item.ParcelNumber, false);

        const addressInput = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.address,
          "id"
        );
        await sendKeysPTaxInputFields(addressInput, item.Address, false);

        const cityInput = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.city,
          "id"
        );
        await sendKeysPTaxInputFields(cityInput, item.City, false);

        const zipInput = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.zip,
          "id"
        );
        await sendKeysPTaxInputFields(zipInput, item.Zip, false);

        const ownerOfRecordInput = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.ownerOfRecord,
          "id"
        );
        await sendKeysPTaxInputFields(
          ownerOfRecordInput,
          item.OwnerOfRecord,
          false
        );

        const defaultAssessorDropdown = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.defaultAssessor,
          "id"
        );
        const correctAssessorSelector = generateDynamicXPath(
          "option",
          item.DefaultAssessor,
          "contains"
        );
        await clickOnSelectOption(
          driver,
          defaultAssessorDropdown,
          correctAssessorSelector
        );

        const defaultCollectorDropdown = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.defaultCollector,
          "id"
        );
        const correctCollectorSelector = generateDynamicXPath(
          "option",
          item.DefaultCollector,
          "contains"
        );
        await clickOnSelectOption(
          driver,
          defaultCollectorDropdown,
          correctCollectorSelector
        );

        const defaultPaymentMethodDropdown = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.defaultPaymentMethod,
          "id"
        );
        const correctPaymentMethodSelector = generateDynamicXPath(
          "option",
          item.DefaultPaymentMethod,
          "contains"
        );
        await clickOnSelectOption(
          driver,
          defaultPaymentMethodDropdown,
          correctPaymentMethodSelector
        );

        const parcelTypeDropdown = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.parcelType,
          "id"
        );
        const correctParcelTypeSelector = generateDynamicXPath(
          "option",
          item.ParcelType,
          "contains"
        );
        await clickOnSelectOption(
          driver,
          parcelTypeDropdown,
          correctParcelTypeSelector
        );

        const ownershipStatusDropdown = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.ownershipStatus,
          "id"
        );
        const correctOwnershipStatusSelector = generateDynamicXPath(
          "option",
          item.OwnershipStatus,
          "equals"
        );
        await clickOnSelectOption(
          driver,
          ownershipStatusDropdown,
          correctOwnershipStatusSelector
        );

        const serviceLevelDropdown = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.serviceLevel,
          "id"
        );
        const correctServiceLevelSelector = generateDynamicXPath(
          "option",
          item.ServiceLevel,
          "contains"
        );
        await clickOnSelectOption(
          driver,
          serviceLevelDropdown,
          correctServiceLevelSelector
        );

        const managementLevelDropdown = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.managementLevel,
          "id"
        );
        const correctManagementLevelSelector = generateDynamicXPath(
          "option",
          item.ManagementLevel,
          "contains"
        );
        await clickOnSelectOption(
          driver,
          managementLevelDropdown,
          correctManagementLevelSelector
        );

        const taxResponsibilityDropdown = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.taxResponsibility,
          "id"
        );
        const correctTaxResponsibilitySelector = generateDynamicXPath(
          "option",
          item.TaxResponsibility,
          "contains"
        );
        await clickOnSelectOption(
          driver,
          taxResponsibilityDropdown,
          correctTaxResponsibilitySelector
        );

        const saveButton = await awaitElementLocatedAndReturn(
          driver,
          addNewParcelsSelectors.saveButton,
          "id"
        );
        await saveButton.click();
        await driver.sleep(5000);
        arrayOfSuccessfulOperations.push(item);
        console.log(
          colors.green.bold(`Succeeded for parcel: ${item.ParcelNumber}`)
        );
      } catch (error) {
        console.log(colors.red.bold(`Failed for parcel: ${item.ParcelNumber}`));
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
    await closingAutomationSystem();
  } catch (error) {
    logErrorMessageCatch(error);
  }
};

module.exports = addNewParcels;
