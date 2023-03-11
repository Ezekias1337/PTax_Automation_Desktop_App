// Functions, Helpers, Utils
const performDataEntry = require("./performOperations/performDataEntry");
const performDataEntryAndDownload = require("./performOperations/performDataEntryAndDownload");
const performDownload = require("./performOperations/performDownload");

const newYorkTaxBills = async (
  automationConfigObject,
  ipcBusClientNodeMain
) => {
  const { operation } = automationConfigObject;

  switch (operation) {
    case "Data Entry":
      /* await performDataEntry(
        state,
        sublocation,
        operation,
        taxWebsiteSelectors
      ); */
      return;
    case "Download Document":
      await performDownload(automationConfigObject, ipcBusClientNodeMain);
      break;
    case "Data Entry, Download, & Upload Document":
      await performDataEntryAndDownload(
        automationConfigObject,
        ipcBusClientNodeMain
      );
      return;
    default:
      console.log("No operation found, check spelling of operation");
      return;
  }
};

module.exports = newYorkTaxBills;
