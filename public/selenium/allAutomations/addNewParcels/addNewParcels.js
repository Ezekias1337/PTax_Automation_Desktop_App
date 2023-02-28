// Library Imports
const colors = require("colors");
// Functions, Helpers, Utils
const loginToPTAX = require("../../functions/pTaxSpecific/login/loginToPTAX");
const closingAutomationSystem = require("../../functions/general/closingAutomationSystem");
const clickOnSelectOption = require("../../functions/general/clickOnSelectOption");
const simulateMouseHover = require("../../functions/general/simulateMouseHover");
const swapToIFrameDefaultContent = require("../../functions/pTaxSpecific/frameSwaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../functions/pTaxSpecific/frameSwaps/swapToIFrame0");
const swapToIFrame1 = require("../../functions/pTaxSpecific/frameSwaps/swapToIFrame1");
const clickCheckMyPropertiesCheckBox = require("../../functions/pTaxSpecific/clickCheckMyPropertiesCheckBox/clickCheckMyPropertiesCheckBox");
const logErrorMessageCatch = require("../../functions/general/consoleLogErrors/logErrorMessageCatch");
const awaitElementLocatedAndReturn = require("../../functions/general/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../functions/general/generateDynamicXPath");
const sendKeysPTaxInputFields = require("../../functions/pTaxSpecific/sendKeysPTaxInputFields/sendKeysPTaxInputFields");
const clickNavbarMenu = require("../../functions/pTaxSpecific/clickNavbar/clickNavbarMenu");
const scrollElementIntoView = require("../../functions/general/scrollElementIntoView");

const sendCurrentIterationInfo = require("../../ipc-bus/sendCurrentIterationInfo");
const sendSuccessfulIteration = require("../../ipc-bus/sendSuccessfulIteration");
const sendFailedIteration = require("../../ipc-bus/sendFailedIteration");
const sendEventLogInfo = require("../../ipc-bus/sendEventLogInfo");
const sendAutomationCompleted = require("../../ipc-bus/sendAutomationCompleted");
const handleAutomationCancel = require("../../ipc-bus/handleAutomationCancel");
// Selectors
const {
  searchByLocationSelector,
  navbarEditSelectors,
  addNewParcelsSelectors,
  newParcelHeader,
} = require("../../ptaxXpathsAndSelectors/allSelectors");

const addNewParcels = async (
  { ptaxUsername, ptaxPassword, spreadsheetContents },
  ipcBusClientNodeMain
) => {
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

        const propertySideBarXPath = generateDynamicXPath(
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
        await sendEventLogInfo(ipcBusClientNodeMain, {
          color: "orange",
          message: `Performing data entry...`,
        });

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

        /* 
          Sometimes the Assessor/Collector have the same name and it can
          cause issues with the xpath, because of this the collector
          uses a more specific selector
        */

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
        await scrollElementIntoView(driver, saveButton);
        await saveButton.click();
        await driver.sleep(5000);
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

    await sendAutomationCompleted(ipcBusClientNodeMain);
    await sendEventLogInfo(ipcBusClientNodeMain, {
      color: "blue",
      message: "The automation is complete.",
    });

    await closingAutomationSystem(driver);
  } catch (error) {
    logErrorMessageCatch(error);
  }
};

module.exports = addNewParcels;
