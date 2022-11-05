// Library imports
const { ipcMain } = require("electron");
const xlsx = require("xlsx");
// Functions, Helpers, and Utils
const {
  replaceBackslashWithForwardSlash,
} = require("../../../shared/utils/replaceBackslashWithForwardSlash");
const {
  removeQuotesFromObjectKeys,
} = require("../../../shared/utils/removeQuotesFromObjectKeys");

const readSpreadsheetFile = async (pathToSpreadsheet) => {
  try {
    let workbook = xlsx.readFile(pathToSpreadsheet);
    let sheetNameList = workbook.SheetNames;
    let worksheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

    const arrayOfObjects = [];

    for (const item of Object.entries(worksheet)) {
      const arrayOfObjectsKeysParsed = removeQuotesFromObjectKeys(item[1]);
      arrayOfObjects.push(arrayOfObjectsKeysParsed);
    }

    return arrayOfObjects;
  } catch (error) {
    return null;
  }
};

module.exports = {
  readSpreadsheetListener: ipcMain.on("readSpreadsheet", (event, message) => {
    if (message === "" || message === null) {
      event.sender.send(
        "spreadsheet parse failed",
        "No spreadsheet file selected. Please select a file before proceeding."
      );
    } else {
      const pathToSpreadsheet = replaceBackslashWithForwardSlash(message);

      try {
        console.log("Attempting to read file...: ", pathToSpreadsheet);
        readSpreadsheetFile(pathToSpreadsheet).then((innerResult) => {
          event.sender.send("spreadsheet parsed", innerResult);
        });
      } catch (error) {
        event.sender.send(
          "spreadsheet parse failed",
          "Failed to parse spreadsheet. Please ensure you are uploading a .xlsx file and that it is not corrupted."
        );
      }
    }
  }),
};
