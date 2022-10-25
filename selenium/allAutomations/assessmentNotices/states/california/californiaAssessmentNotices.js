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

/* 
  const californiaAssessmentNotices = async (sublocation, operation) => {
*/

const californiaAssessmentNotices = async ({
  automation,
  uploadDirectory,
  downloadDirectory,
  state,
  county,
  operation,
}) => {
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
      switch (county) {
        case "Kern":
          await performDataEntryKern(uploadDirectory, downloadDirectory);
          break;
        case "Los Angeles":
          await performDataEntryLosAngeles(uploadDirectory, downloadDirectory);
          break;
        case "Riverside":
          await performDataEntryRiverside(uploadDirectory, downloadDirectory);
          break;
        case "San Bernardino":
          await performDataEntrySanBernardino(
            uploadDirectory,
            downloadDirectory
          );
          break;
        case "San Diego":
          await performDataEntrySanDiego(uploadDirectory, downloadDirectory);
          break;
        default:
          break;
      }
      break;
    case "Download Files":
      switch (county) {
        case "Kern":
          await performDownloadKern(uploadDirectory, downloadDirectory);
          break;
        case "Los Angeles":
          await performDownloadLosAngeles(uploadDirectory, downloadDirectory);
          break;
        case "Riverside":
          await performDownloadRiverside(uploadDirectory, downloadDirectory);
          break;
        case "San Bernardino":
          await performDownloadSanBernardino(
            uploadDirectory,
            downloadDirectory
          );
          break;
        case "San Diego":
          await performDownloadSanDiego(uploadDirectory, downloadDirectory);
          break;
        default:
          break;
      }
      break;
    case "Data Entry, Download, & Upload Document":
      switch (county) {
        case "Kern":
          await performDataEntryAndDownloadKern(
            uploadDirectory,
            downloadDirectory
          );
          break;
        case "Los Angeles":
          await performDataEntryAndDownloadLosAngeles(
            uploadDirectory,
            downloadDirectory
          );
          break;
        case "Riverside":
          await performDataEntryAndDownloadRiverside(
            uploadDirectory,
            downloadDirectory
          );
          break;
        case "San Bernardino":
          await performDataEntryAndDownloadSanBernardino(
            uploadDirectory,
            downloadDirectory
          );
          break;
        case "San Diego":
          await performDataEntryAndDownloadSanDiego(
            uploadDirectory,
            downloadDirectory
          );
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
