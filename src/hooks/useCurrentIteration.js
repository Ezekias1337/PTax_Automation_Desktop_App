// Library Imports
import { useEffect, useState } from "react";
// Functions, Helpers, Utils, and Hooks
import { removeSpacesFromString } from "../utils/strings/removeSpacesFromString";
// Constants
import { iteratorTypes } from "../constants/iteratorTypes";

/* 
  The NumericalProgressTracker, ProgressBar, and TimeTracker components
  all need access to the number which represents the current index of
  the row in the spreadsheet that the script is working on, that
  is what this hook provides to the components.
*/

export const useCurrentIteration = (
  automationName,
  attributeToFindCurrentIteration,
  setAttributeToFindCurrentIteration,
  spreadsheetContents,
  automationCurrentIteration,
  setCurrentIterationNumber,
  addOne = true
) => {
  const [oneAdded, setOneAdded] = useState(false);

  /* 
    Use the iteratorTypes const file to find the name of the "iterator" for the
    automation. In most cases this is ParcelNumber, but it can be "URL" for
    others.
  */

  useEffect(() => {
    const automationNameSpacesRemoved = removeSpacesFromString(automationName);

    setAttributeToFindCurrentIteration(
      iteratorTypes[automationNameSpacesRemoved]
    );
  }, [automationName, setAttributeToFindCurrentIteration]);

  /* 
    Find the index of the current iteration in the spreadsheetContents,
    then add 1 to it to display the progress to the user
  */

  useEffect(() => {
    if (attributeToFindCurrentIteration !== null) {
      let tempCurrentIterationNumber = spreadsheetContents.data.findIndex(
        (spreadSheetRow) =>
          spreadSheetRow[attributeToFindCurrentIteration] ===
          automationCurrentIteration
      );

      if (tempCurrentIterationNumber >= 0) {
        if (addOne === true && oneAdded === false) {
          tempCurrentIterationNumber += 1;
          setOneAdded(true);
        }

        setCurrentIterationNumber(tempCurrentIterationNumber);
      }
    }
  }, [
    attributeToFindCurrentIteration,
    automationCurrentIteration,
    spreadsheetContents,
    setCurrentIterationNumber,
    addOne,
    oneAdded,
  ]);
};
