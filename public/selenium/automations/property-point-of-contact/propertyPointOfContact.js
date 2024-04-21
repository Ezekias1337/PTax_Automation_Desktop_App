// Functions, Helpers, Utils
const loginToPtax = require("../../functions/ptax-specific/loginToPtax");
const closingAutomationSystem = require("../../functions/driver/closingAutomationSystem");
const sendMessageToFrontEnd = require("../../functions/ipc-bus/sendMessage/sendMessageToFrontEnd");

const navigateToProperty = require("./helpers/navigateToProperty");
const updatePointOfContactInfo = require("./helpers/updatePointOfContactInfo");
const handleIterationError = require("../../helpers/handleIterationError");
const handleGlobalError = require("../../helpers/handleGlobalError");

const propertyPointOfContact = async (
  { ptaxUsername, ptaxPassword, spreadsheetContents },
  ipcBusClientNodeMain
) => {
  try {
    const { driver } = await loginToPtax(
      ptaxUsername,
      ptaxPassword,
      ipcBusClientNodeMain
    );

    for (const item of spreadsheetContents) {
      try {
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Current Iteration", {
          primaryMessage: item.Property,
          messageColor: null,
          errorMessage: null,
        });
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Working on Property: ${item.Property}`,
          messageColor: "regular",
          errorMessage: null,
        });
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Navigating to property: ${item.Property} in Ptax`,
          messageColor: "orange",
        });
        await navigateToProperty(driver, item);

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Performing data entry...`,
          messageColor: "yellow",
        });
        await updatePointOfContactInfo(driver, item);

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
          primaryMessage: `Succeeded for property: ${item.Property}`,
          messageColor: "green",
        });
      } catch (error) {
        await handleIterationError({
          driver,
          ipcBusClientNodeMain,
          message: `Failed for parcel: ${item.Property}`,
          iterator: item.Property,
        });
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

module.exports = propertyPointOfContact;
