const colors = require("colors");
const consoleLogLine = require("../general/consoleLogLine");
const closingAutomationSystem = require("../general/closingAutomationSystem");

/* Need to use console.table for the example columns */

const verifySpreadSheetColumnNames = (
  arrayOfColumnNames,
  rowFromSpreadsheet
) => {
  console.log(
    colors.blue("Verifying that the spreadsheet file has the correct columns."),
    "\n"
  );

  const arrayOfMissingColumnNames = [];
  let areCorrectSheetColumnsPresent = true;
  for (const columnName of arrayOfColumnNames) {
    if (rowFromSpreadsheet && rowFromSpreadsheet[columnName]) {
    } else {
      arrayOfMissingColumnNames.push(columnName);
      areCorrectSheetColumnsPresent = false;
    }
  }

  return [areCorrectSheetColumnsPresent, arrayOfMissingColumnNames];
};

module.exports = verifySpreadSheetColumnNames;
