// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// Action Types
import { SELECT_SPREADSHEET } from "../../redux/actionCreators/spreadsheetCreators";
import { RECEIVE_ITERATION } from "../../redux/actionCreators/automationCreators";
// Functions, Helpers, Utils, and Hooks
import { removeSpacesFromString } from "../../utils/strings/removeSpacesFromString";
// Constants
import { iteratorTypes } from "../../constants/iteratorTypes";
// CSS
import "../../css/numerical-progress-tracker.scss";

export const NumericalProgressTracker = ({
  isInitializing = false,
  maxNumberOfOperations,
  automationName,
}) => {
  const state = useSelector((state) => state);
  const automationState = state.automation;
  const spreadsheetState = state.spreadsheet;

  const automationCurrentIteration =
    automationState.currentIteration[RECEIVE_ITERATION];
  const spreadsheetContents = spreadsheetState.contents[SELECT_SPREADSHEET];

  const [animationParent] = useAutoAnimate();

  const [currentIterationNumber, setCurrentIterationNumber] = useState(0);
  const [attributeToFindCurrentIteration, setAttributeToFindCurrentIteration] =
    useState(null);

  /* 
    ! NEED THESE TWO USEFFECTS TO BE EXTRACTED TO A CUSTOM HOOK,
    ! AS THE LOGIC IS REPEATED IN progressBar.js
  */

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
  }, [automationName]);

  /* 
    Find the index of the current iteration in the spreadsheetContents,
    then add 1 to it to display the progress to the user
  */

  useEffect(() => {
    if (attributeToFindCurrentIteration !== null) {
      const tempCurrentIterationNumber = spreadsheetContents.data.findIndex(
        (spreadSheetRow) =>
          spreadSheetRow[attributeToFindCurrentIteration] ===
          automationCurrentIteration
      );
      console.log(tempCurrentIterationNumber)
      if (tempCurrentIterationNumber >= 0) {
        setCurrentIterationNumber(tempCurrentIterationNumber + 1);
      }
    }
  }, [
    attributeToFindCurrentIteration,
    automationCurrentIteration,
    spreadsheetContents,
  ]);

  if (isInitializing === true || currentIterationNumber === 0) {
    return <></>;
  }

  return (
    <div className="container" id="numericalProgressTrackerWrapper">
      <div className="row">
        <div className="col col-12">
          <h4 id="numericalProgressTracker" ref={animationParent}>
            Working on {currentIterationNumber}/{maxNumberOfOperations}
          </h4>
        </div>
      </div>
    </div>
  );
};
