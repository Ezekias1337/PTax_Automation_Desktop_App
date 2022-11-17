// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useAutoAnimate } from "@formkit/auto-animate/react";
// Functions, Helpers, Utils, and Hooks
import { removeSpacesFromString } from "../../utils/strings/removeSpacesFromString";
// Constants
import { iteratorTypes } from "../../constants/iteratorTypes";
// Action Types
import { READ_SPREADSHEET } from "../../redux/actionCreators/spreadsheetCreators";
import { RECEIVE_ITERATION } from "../../redux/actionCreators/automationCreators";
// CSS
import "../../css/progress-bar.scss";

export const ProgressBar = ({ automationName, automationFinished }) => {
  const state = useSelector((state) => state);
  const automationState = state.automation;
  const spreadsheetState = state.spreadsheet;

  const automationCurrentIteration =
    automationState.currentIteration[RECEIVE_ITERATION];
  const spreadsheetContents = spreadsheetState.contents[READ_SPREADSHEET];

  const [animationParent] = useAutoAnimate();

  const [numberOfDataPoints, setNumberOfDataPoints] = useState(0);
  const [percentagePerDataPoint, setPercentagePerDataPoint] = useState(0);
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [currentIterationNumber, setCurrentIterationNumber] = useState(0);
  const [attributeToFindCurrentIteration, setAttributeToFindCurrentIteration] =
    useState(null);

  /* 
    Get the number of rows the spreadsheet has
  */

  useEffect(() => {
    let numberOfRows = spreadsheetContents?.length;

    if (typeof (numberOfRows === "number") && numberOfRows > 0) {
      setNumberOfDataPoints(numberOfRows);
    }
  }, [spreadsheetContents]);

  /* 
    Use the number of rows to determine how much of a
    percentage each one counts for
  */

  useEffect(() => {
    if (numberOfDataPoints !== 0) {
      let tempPercentagePerDataPoint = 100 / numberOfDataPoints;
      setPercentagePerDataPoint(tempPercentagePerDataPoint);
    }
  }, [numberOfDataPoints]);

  /* 
    ! NEED THESE TWO USEFFECTS TO BE EXTRACTED TO A CUSTOM HOOK,
    ! AS THE LOGIC IS REPEATED IN numericalProgressTracker.js,
    ! Except this one doesn't add a + 1
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
      const tempCurrentIterationNumber = spreadsheetContents.findIndex(
        (spreadSheetRow) =>
          spreadSheetRow[attributeToFindCurrentIteration] ===
          automationCurrentIteration
      );
      if (tempCurrentIterationNumber >= 0) {
        setCurrentIterationNumber(tempCurrentIterationNumber);
      }
    }
  }, [
    attributeToFindCurrentIteration,
    automationCurrentIteration,
    spreadsheetContents,
  ]);

  /* 
    Now that we have the currentIterationNumber, multiply it by the
    percentagePerDataPoint to get the width for the progress bar
  */

  useEffect(() => {
    const tempCurrentPercentage =
      currentIterationNumber * percentagePerDataPoint;
    setCurrentPercentage(tempCurrentPercentage);
  }, [currentIterationNumber, percentagePerDataPoint]);

  /* 
    Increase width to 100 if the automation is done running
  */
  
  useEffect(() => {
    if (automationFinished === true) {
      setCurrentPercentage(100);
    }
  }, [automationFinished, setCurrentPercentage]);

  return (
    <div
      className="container mx-auto"
      id="progressBarWrapper"
      ref={animationParent}
    >
      <div id="progressBar" style={{ width: `${currentPercentage}%` }}></div>
      <div
        id="progressBarFrostEffect"
        style={{ width: `${currentPercentage}%` }}
      ></div>
      <h5 id="progressPercentage">{currentPercentage}%</h5>
    </div>
  );
};
