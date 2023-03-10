// Functions, Helpers, Utils
import { showToast } from "../functions/toast/showToast";
import { camelCasifyString } from "../utils/strings/camelCasifyString";

export const validateSpreadsheet = (
  setStateHook,
  spreadsheetContents,
  spreadsheetColumns,
  automationName
) => {
  /* 
    Pick column based off automationName 
  */
  const columnForAutomation =
    spreadsheetColumns[camelCasifyString(automationName)];

  /* 
    Iterate through columnForAutomation to verify the first index
    of spreadsheetContents
  */
  let validationSuccessful = true;
  let arrayOfMissingColumns = [];

  for (const [index, column] of columnForAutomation.entries()) {
    let columnIsPresent = spreadsheetContents.data[0][column];

    if (columnIsPresent === undefined) {
      arrayOfMissingColumns.push(column);
    }
  }

  /* 
    If there are missing columns send the list of missing columns
    show toast, otherwise proceed to next step of automation
  */

  if (arrayOfMissingColumns?.length > 0) {
    let missingColString = "";

    for (const [index, col] of arrayOfMissingColumns.entries()) {
      if (index < arrayOfMissingColumns.length - 1) {
        missingColString += `${col}, `;
      } else {
        missingColString += `and ${col}`;
      }
    }

    const missingColumnsMsg = `You are missing the following columns from your spreadsheet: ${missingColString}.\nGo to the Spreadsheet Template Page for more information.`;
    showToast(missingColumnsMsg);
  } else {
    setStateHook(true);
  }
};
