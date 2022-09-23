const colors = require("colors");

//Kern Imports
const performDataEntryKern = require("./cities/kern/performOperations/performDataEntryKern");
const performDownloadKern = require("./cities/kern/performOperations/performDownloadKern");
const performDataEntryAndDownloadKern = require("./cities/kern/performOperations/performDataEntryAndDownloadKern");

//Los Angeles Imports
const performDataEntryLosAngeles = require("./cities/losAngeles/performOperations/performDataEntryLosAngeles");
const performDownloadLosAngeles = require("./cities/losAngeles/performOperations/performDownloadLosAngeles");
const performDataEntryAndDownloadLosAngeles = require("./cities/losAngeles/performOperations/performDataEntryAndDownloadLosAngeles");

//Riverside Imports
const performDataEntryRiverside = require("./cities/riverside/performOperations/performDataEntryRiverside");
const performDownloadRiverside = require("./cities/riverside/performOperations/performDownloadRiverside");
const performDataEntryAndDownloadRiverside = require("./cities/riverside/performOperations/performDataEntryAndDownloadRiverside");

//San Bernardino Imports
const performDataEntrySanBernardino = require("./cities/sanBernardino/performOperations/performDataEntrySanBernardino");
const performDownloadSanBernardino = require("./cities/sanBernardino/performOperations/performDownloadSanBernardino");
const performDataEntryAndDownloadSanBernardino = require("./cities/sanBernardino/performOperations/performDataEntryAndDownloadSanBernardino");

//San Diego Imports
const performDataEntrySanDiego = require("./cities/sanDiego/performOperations/performDataEntrySanDiego");
const performDownloadSanDiego = require("./cities/sanDiego/performOperations/performDownloadSanDiego");
const performDataEntryAndDownloadSanDiego = require("./cities/sanDiego/performOperations/performDataEntryAndDownloadSanDiego");

const californiaAssessmentNotices = async (sublocation, operation) => {
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
      switch (sublocation) {
        case "Kern":
          await performDataEntryKern();
          break;
        case "Los Angeles":
          await performDataEntryLosAngeles();
          break;
        case "Riverside":
          await performDataEntryRiverside();
          break;
        case "San Bernardino":
          await performDataEntrySanBernardino();
          break;
        case "San Diego":
          await performDataEntrySanDiego();
          break;
        default:
          break;
      }
      break;
    case "Download Files":
      switch (sublocation) {
        case "Kern":
          await performDownloadKern();
          break;
        case "Los Angeles":
          await performDownloadLosAngeles();
          break;
        case "Riverside":
          await performDownloadRiverside();
          break;
        case "San Bernardino":
          await performDownloadSanBernardino();
          break;
        case "San Diego":
          await performDownloadSanDiego();
          break;
        default:
          break;
      }
      break;
    case "Data Entry And Download Files":
      switch (sublocation) {
        case "Kern":
          await performDataEntryAndDownloadKern();
          break;
        case "Los Angeles":
          await performDataEntryAndDownloadLosAngeles();
          break;
        case "Riverside":
          await performDataEntryAndDownloadRiverside();
          break;
        case "San Bernardino":
          await performDataEntryAndDownloadSanBernardino();
          break;
        case "San Diego":
          await performDataEntryAndDownloadSanDiego();
          break;
        default:
          break;
      }
      break;
    default:
      console.log("No operation found, check spelling of operation");
      break;
  }
};

module.exports = californiaAssessmentNotices;
