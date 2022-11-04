const colors = require("colors");
const columnNamesIncorrect = require("../../functions/general/consoleLogErrors/columnNamesIncorrect");
const closingAutomationSystem = require("../../functions/general/closingAutomationSystem");

const handleColumnNameLogging = async (
  areCorrectSheetColumnsPresent,
  arrayOfMissingColumnNames
) => {
  if (areCorrectSheetColumnsPresent === true) {
    console.log(
      colors.green.bold("The column names have been verified!"),
      "\n"
    );
  } else {
    columnNamesIncorrect(arrayOfMissingColumnNames);
    await closingAutomationSystem();
    return;
  }
};

module.exports = handleColumnNameLogging;
