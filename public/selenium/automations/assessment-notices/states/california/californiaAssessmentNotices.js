const performDataEntry = require("./performOperations/performDataEntryAndDownload");
const performDownload = require("./performOperations/performDownload");
const performDataEntryAndDownload = require("./performOperations/performDataEntryAndDownload");

const californiaAssessmentNotices = async (
  automationConfigObject,
  ipcBusClientNodeMain
) => {
  const { operation } = automationConfigObject;

  switch (operation) {
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

module.exports = californiaAssessmentNotices;
