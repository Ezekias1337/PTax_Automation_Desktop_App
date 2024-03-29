// Library Imports
import { useEffect } from "react";

export const useIsFormFilled = (
  selectedChoices,
  setStateHook,
  includeSpreadsheet = false
) => {
  /* 
    When the form has been filled out and the spreadsheet filepath
    ends in the desired file extension (only required if spreadsheet file  
    is part of the form), use the setStatehook and set it's value to true
  */

  useEffect(() => {
    const tempSelectedChoices = { ...selectedChoices };
    let doesEmptyValueExist = false;
    let isSpreadsheetSelected = false;
    let isFourDigitYearNecessary = false;
    let isFourDigitYearSelected = false;

    for (const [key, value] of Object.entries(tempSelectedChoices)) {
      if (value === "" || value === undefined) {
        doesEmptyValueExist = true;
      }

      if (key === "spreadsheetFile") {
        let checkFileExtension = value.slice(-5);
        if (checkFileExtension.toLowerCase() === ".xlsx") {
          isSpreadsheetSelected = true;
        }
      } else if (key.toLowerCase().includes("year")) {
        isFourDigitYearNecessary = true;
        if (value?.length === 4) {
          isFourDigitYearSelected = true;
        } else {
          isFourDigitYearSelected = false;
          setStateHook(false);
        }
      }
    }

    if (isFourDigitYearNecessary === true && includeSpreadsheet === true) {
      if (
        isFourDigitYearSelected === true &&
        doesEmptyValueExist === false &&
        isSpreadsheetSelected === true
      ) {
        setStateHook(true);
      }
    } else if (includeSpreadsheet === true) {
      if (doesEmptyValueExist === false && isSpreadsheetSelected === true) {
        setStateHook(true);
      } else if (doesEmptyValueExist === true) {
        setStateHook(false);
      }
    } else {
      if (doesEmptyValueExist === false) {
        setStateHook(true);
      } else if (doesEmptyValueExist === true) {
        setStateHook(false);
      }
    }
  }, [selectedChoices, setStateHook, includeSpreadsheet]);
};
