// Library imports
const { ipcMain } = require("electron");
const xlsx = require("xlsx");
// Functions, Helpers, and Utils
const {
  replaceBackslashWithForwardSlash,
} = require("../../../../shared/utils/replaceBackslashWithForwardSlash");
const {
  removeQuotesFromObjectKeys,
} = require("../../../../shared/utils/removeQuotesFromObjectKeys");

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
  readSpreadsheetListener: ipcMain.on(
    "readSpreadsheet",
    async (event, message) => {
      const pathToSpreadsheet = replaceBackslashWithForwardSlash(message);

      try {
        console.log("attempting to read file...: ", pathToSpreadsheet);
        const result = await readSpreadsheetFile(pathToSpreadsheet);
        event.sender.send("spreadsheetParsed", result);
      } catch (error) {
        console.log(error);
      }
    }
  ),
};
