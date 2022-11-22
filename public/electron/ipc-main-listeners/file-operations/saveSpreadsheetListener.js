// Library imports
const { ipcMain } = require("electron");
const log = require("electron-log");
const xlsx = require("xlsx");
// Functions, Helpers, and Utils
const {
  replaceBackslashWithForwardSlash,
} = require("../../../shared/utils/replaceBackslashWithForwardSlash");
const {
  removeQuotesFromObjectKeys,
} = require("../../../shared/utils/removeQuotesFromObjectKeys");
const checkIfObjectIsEmpty = require("../../../shared/utils/checkIfObjectIsEmpty");

const saveSpreadsheetFile = async (
  pathToSaveSpreadsheet,
  arrayOfSheets,
  fileName
) => {
  try {
    /* 
      Create the workbook 
    */
    const workBook = xlsx.utils.book_new();

    /* 
      Create one sheet for each index in arrayOfSheets,
      and append them to the workbook
    */
    for (const sheet of arrayOfSheets) {
      const currentSheet = xlsx.utils.json_to_sheet(sheet.sheetData);
      xlsx.utils.book_append_sheet(workBook, currentSheet, sheet.sheetName);
    }

    /* 
      Create the spreadsheet file
    */
    console.log("workBook: ", workBook);
    console.log("pathToSaveSpreadsheet: ", pathToSaveSpreadsheet);
    console.log("fileName: ", fileName);
    xlsx.writeFile(workBook, `${pathToSaveSpreadsheet}/${fileName}.xlsx`);
  } catch (error) {
    console.log(
      "Either the provided filepath or the contents of the file are invalid. The specific error is: ",
      error
    );
    log.info(
      "Either the provided filepath or the contents of the file are invalid. The specific error is: ",
      error
    );
  }
};

module.exports = {
  saveSpreadsheetListener: ipcMain.on("save spreadsheet", (event, message) => {
    if (checkIfObjectIsEmpty(message) === true || message === null) {
      event.sender.send(
        "spreadsheet save failed",
        "Received an empty or null object, check the data being sent."
      );
    } else {
      const pathToSaveSpreadsheet = replaceBackslashWithForwardSlash(
        message.downloadDirectory
      );

      try {
        console.log(
          "Attempting to save spreadsheet...: ",
          pathToSaveSpreadsheet
        );
        saveSpreadsheetFile(
          pathToSaveSpreadsheet,
          message.arrayOfSheets,
          message.fileName
        ).then(() => {
          event.sender.send("spreadsheet save", null);
        });
      } catch (error) {
        event.sender.send(
          "spreadsheet save failed",
          `Either the provided filepath or the contents of the file are invalid. The specific error is: ${error}`
        );
      }
    }
  }),
};
