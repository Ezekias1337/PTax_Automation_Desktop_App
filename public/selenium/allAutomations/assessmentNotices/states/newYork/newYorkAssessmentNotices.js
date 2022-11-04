const colors = require("colors");
const performDataEntry = require("./performOperations/performDataEntry");
const performDownload = require("./performOperations/performDownload");
const performDataEntryAndDownload = require("./performOperations/performDataEntryAndDownload");

const newYorkAssessmentNotices = async (sublocation, operation) => {
  console.log(
    colors.bold.red(
      "Warning: ensure the data in the Parcel Number column all follow the convention: "
    ),
    "\n",
    "Burough-Block-Lot",
    "\n",
    "Example: 1-482-1302"
  );

  switch (operation) {
    case "Data Entry":
      await performDataEntry();
      return;
    case "Download Files":
      await performDownload();
      break;
    case "Data Entry, Download, & Upload Document":
      await performDataEntryAndDownload();
      return;
    default:
      console.log("No operation found, check spelling of operation");
      return;
  }
};

module.exports = newYorkAssessmentNotices;
