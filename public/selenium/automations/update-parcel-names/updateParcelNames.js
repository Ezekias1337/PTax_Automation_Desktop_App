// Functions, Helpers, Utils
const consoleLogLine = require("../../functions/general/consoleLogLine");
const loginToPTAX = require("../../functions/ptax-specific/loginToPTAX");
const swapToIFrame0 = require("../../functions/ptax-specific/frame-swaps/swapToIFrame0");
const swapToIFrame1 = require("../../functions/ptax-specific/frame-swaps/swapToIFrame1");
const swapToIFrameDefaultContent = require("../../functions/ptax-specific/frame-swaps/swapToIFrameDefaultContent");
const clickCheckMyPropertiesCheckBox = require("../../functions/ptax-specific/clickCheckMyPropertiesCheckBox");
const awaitElementLocatedAndReturn = require("../../utils/waits/awaitElementLocatedAndReturn");
const sendKeysInputFields = require("../../utils/web-elements/sendKeysInputFields");
const generateDynamicXPath = require("../../utils/strings/generateDynamicXPath");
// Constants

// Selectors
const {
  searchByParcelNumberSelector,
  taxBillDrivenTabSelector,
  editDetailsSelector,
  addNewParcelsSelectors,
} = require("../../constants/selectors/allSelectors");

const updateParcelNames = async () => {
  console.log(`Running update parcel automation: `);
  //const dataFromSpreadsheet = await readSpreadsheetFile();
  /* const [areCorrectSheetColumnsPresent, arrayOfMissingColumnNames] =
    verifySpreadSheetColumnNames(renameParcelsColumns, dataFromSpreadsheet[0]);

  if (areCorrectSheetColumnsPresent === false) {
    return;
  } */

  const { username, password } = await promptLogin();
  const [ptaxWindow, driver] = await loginToPTAX(username, password);

  /* These values will be null if the login failed, this will cause the execution
    to stop */

  if (ptaxWindow === null || driver === null) {
    return;
  }

  await swapToIFrame0(driver);
  await clickCheckMyPropertiesCheckBox(driver);
  let arrayOfSuccessfulParcels = [];
  let arrayOfFailedParcels = [];

  for (const item of dataFromSpreadsheet) {
    const oldParcelName = item.OldParcelNumber;
    const newParcelName = item.NewParcelNumber;

    consoleLogLine();
    console.log(`Renaming parcel ${oldParcelName} => ${newParcelName}`);

    try {
      /* 
        Eventually Chrome will run out of memory depending on how long this is running for.
        Refreshing the page will prevent the 'Aw, Snap!' error
      */
      await driver.navigate().refresh();
      await swapToIFrameDefaultContent(driver);

      const searchByParcelInput = await awaitElementLocatedAndReturn(
        driver,
        searchByParcelNumberSelector,
        "id"
      );
      await sendKeysInputFields(
        searchByParcelInput,
        item.OldParcelNumber,
        true
      );

      await swapToIFrame0(driver);
      const propertySideBarXPath = generateDynamicXPath(
        "a",
        item.OldParcelNumber,
        "contains"
      );
      const parcelToRenameLink = await awaitElementLocatedAndReturn(
        driver,
        propertySideBarXPath,
        "xpath"
      );

      await parcelToRenameLink.click();
      await driver.sleep(2500);
      await swapToIFrame1(driver);

      const taxBillDrivenTab = await awaitElementLocatedAndReturn(
        driver,
        taxBillDrivenTabSelector,
        "xpath"
      );

      const taxBillDrivenTabClassName = await taxBillDrivenTab.getAttribute(
        "className"
      );
      if (taxBillDrivenTabClassName !== "selected") {
        await taxBillDrivenTab.click();
      }

      const editParcelNameButton = await awaitElementLocatedAndReturn(
        driver,
        editDetailsSelector,
        "xpath"
      );

      await editParcelNameButton.click();

      const parcelNumberInputField = await awaitElementLocatedAndReturn(
        driver,
        addNewParcelsSelectors.parcel,
        "id"
      );
      await sendKeysInputFields(
        parcelNumberInputField,
        item.NewParcelNumber,
        false
      );

      const saveEditToNameButton = await awaitElementLocatedAndReturn(
        driver,
        addNewParcelsSelectors.saveButton,
        "id"
      );
      await saveEditToNameButton.click();

      arrayOfSuccessfulParcels.push(item);
      await swapToIFrameDefaultContent(driver);
      console.log("Parcel renamed successfully!");
      /* const amountToSleep = generateDelayNumber();
      await driver.sleep(amountToSleep); */
      consoleLogLine();
    } catch (error) {
      arrayOfFailedParcels.push(item);
      await swapToIFrameDefaultContent(driver);
      console.log("Parcel failed to be renamed");
      consoleLogLine();
    }
  }
};

module.exports = updateParcelNames;
