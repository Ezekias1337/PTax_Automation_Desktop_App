// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// Functions, Helpers, Utils, and Hooks
import { roundDecimal } from "../../utils/numbers/roundDecimal";
import { useCurrentIteration } from "../../hooks/useCurrentIteration";
// Action Types
import { SELECT_SPREADSHEET } from "../../redux/actionCreators/spreadsheetCreators";
import { RECEIVE_ITERATION } from "../../redux/actionCreators/automationCreators";
// CSS
import "../../css/progress-bar.scss";

export const ProgressBar = ({ automationName, automationFinished }) => {
  const state = useSelector((state) => state);
  const automationState = state.automation;
  const spreadsheetState = state.spreadsheet;

  const automationCurrentIteration =
    automationState.currentIteration[RECEIVE_ITERATION];
  const spreadsheetContents = spreadsheetState.contents[SELECT_SPREADSHEET];

  const [animationParent] = useAutoAnimate();

  const [numberOfDataPoints, setNumberOfDataPoints] = useState(0);
  const [percentagePerDataPoint, setPercentagePerDataPoint] = useState(0);
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [currentIterationNumber, setCurrentIterationNumber] = useState(0);
  const [attributeToFindCurrentIteration, setAttributeToFindCurrentIteration] =
    useState(null);

  useCurrentIteration(
    automationName,
    attributeToFindCurrentIteration,
    setAttributeToFindCurrentIteration,
    spreadsheetContents,
    automationCurrentIteration,
    setCurrentIterationNumber,
    false
  );

  /* 
    Get the number of rows the spreadsheet has
  */

  useEffect(() => {
    let numberOfRows = spreadsheetContents?.data?.length;

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
      setPercentagePerDataPoint(roundDecimal(tempPercentagePerDataPoint, 2));
    }
  }, [numberOfDataPoints]);

  /* 
    Now that we have the currentIterationNumber, multiply it by the
    percentagePerDataPoint to get the width for the progress bar
  */

  useEffect(() => {
    const tempCurrentPercentage =
      currentIterationNumber * percentagePerDataPoint;
    setCurrentPercentage(roundDecimal(tempCurrentPercentage, 2));
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
    <div className="container mx-auto" id="progressBarWrapper">
      <div
        id="progressBar"
        style={{ width: `${currentPercentage}%` }}
        ref={animationParent}
      ></div>
      <div
        id="progressBarFrostEffect"
        style={{ width: `${currentPercentage}%` }}
      ></div>
      <h5 id="progressPercentage">{currentPercentage}%</h5>
    </div>
  );
};
