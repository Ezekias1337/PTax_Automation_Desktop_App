// Library Imports
const colors = require("colors");
// Functions, Helpers, Utils
const performDataEntry = require("./performOperations/performDataEntry");
const performDownload = require("./performOperations/performDownload");
const performDataEntryAndDownload = require("./performOperations/performDataEntryAndDownload");

const newYorkAssessmentNotices = async (
  automationConfigObject,
  ipcBusClientNodeMain
) => {
  console.log(
    colors.bold.red(
      "Warning: ensure the data in the Parcel Number column all follow the convention: "
    ),
    "\n",
    "Burough-Block-Lot",
    "\n",
    "Example: 1-482-1302"
  );
  console.table(automationConfigObject);

  switch (automationConfigObject.operation) {
    case "Data Entry":
      await performDataEntry(automationConfigObject, ipcBusClientNodeMain);
      return;
    case "Download Files":
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

module.exports = newYorkAssessmentNotices;
