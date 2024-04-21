// Functions, Helpers, Utils
const consoleLogLine = require("../../functions/general/consoleLogLine");
const loginToPtax = require("../../functions/ptax-specific/loginToPtax");
const swapToIFrame0 = require("../../functions/ptax-specific/frame-swaps/swapToIFrame0");
const swapToIFrame1 = require("../../functions/ptax-specific/frame-swaps/swapToIFrame1");
const swapToIFrameDefaultContent = require("../../functions/ptax-specific/frame-swaps/swapToIFrameDefaultContent");

const handleGlobalError = require("../../helpers/handleGlobalError");

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
  try {
    const { username, password } = await promptLogin();
    const { driver } = await loginToPtax(
      username,
      password,
      ipcBusClientNodeMain
    );

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

module.exports = updateParcelNames;
