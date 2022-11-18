const colors = require("colors");
const performDataEntry = require("./performOperations/performDataEntry");
const performDataEntryAndDownload = require("./performOperations/performDataEntryAndDownload");
const performDownload = require("./performOperations/performDownload");
const performUploadOriginalDocument = require("./performOperations/performUploadOriginalDocument");

const californiaTaxBills = async (
  automationConfigObject,
  ipcBusClientNodeMain
) => {
  const { county, operation } = automationConfigObject;

  switch (operation) {
    case "Data Entry":
      await performDataEntry(automationConfigObject, ipcBusClientNodeMain);
      break;
    case "Download Files":
      await performDownload(automationConfigObject, ipcBusClientNodeMain);
      break;
    case "Data Entry, Download, & Upload Document":
      await performDataEntryAndDownload(
        automationConfigObject,
        ipcBusClientNodeMain
      );
      break;
    case "Upload Original Document":
      await performUploadOriginalDocument(
        automationConfigObject,
        ipcBusClientNodeMain
      );
      break;
    default:
      console.log("No operation found, check spelling of operation");
      return;
  }
};

module.exports = californiaTaxBills;
