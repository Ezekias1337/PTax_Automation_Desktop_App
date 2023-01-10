// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useStopwatch, useTimer } from "react-timer-hook";
// Functions, Helpers, Utils, and Hooks
import { removeSpacesFromString } from "../../utils/strings/removeSpacesFromString";
import { roundDecimal } from "../../utils/numbers/roundDecimal";
import { useCurrentIteration } from "../../hooks/useCurrentIteration";
// Constants
import { iteratorTypes } from "../../constants/iteratorTypes";
// Components
import { Loader } from "../general-page-layout/loader";
// Action Types
import { SELECT_SPREADSHEET } from "../../redux/actionCreators/spreadsheetCreators";
import { RECEIVE_ITERATION } from "../../redux/actionCreators/automationCreators";

export const TimeTracker = ({ automationName, currentIteration }) => {
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

  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
  });
  const [initializationTime, setInitializationTime] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
  });

  const {
    seconds,
    minutes,
    hours,
    start,
    /* pause,
    reset, */
  } = useStopwatch({ autoStart: false });

  useCurrentIteration(
    automationName,
    attributeToFindCurrentIteration,
    setAttributeToFindCurrentIteration,
    spreadsheetContents,
    automationCurrentIteration,
    setCurrentIterationNumber,
    true
  );

  /* 
    Initialize stopwatch
  
    start is intentionally not included in dependancy array because
    it causes infinite loop
  */

  useEffect(() => {
    console.log("currentIterationNumber: ", currentIterationNumber);
    if (currentIterationNumber === 1) {
      start();
    }
  }, [currentIterationNumber]);

  /* useEffect(() => {
    start();
  }, []); */

  /* 
    When current iteration is no longer null, start using the average
    time to complete iteration to update the estimatedTimeRemaining
  */

  useEffect(() => {
    if (currentIteration !== null) {
    }
  }, [currentIteration]);

  /* 
    Don't show component until initialization is complete
  */

  if (seconds === 0 && minutes === 0 && hours === 0) {
    return <></>;
  }

  return (
    <div
      className="container mt-1"
      id="timeTrackerWrapper"
      ref={animationParent}
    >
      <div className="row">
        <div className="col col-12 col-md-6">
          <h5 id="timeElapsed">
            Time Elapsed: {`${hours}:${minutes}:${seconds}`}
          </h5>
        </div>
        <div className="col col-12 col-md-6">
          {estimatedTimeRemaining.seconds === 0 &&
          estimatedTimeRemaining.minutes === 0 &&
          estimatedTimeRemaining.hours === 0 ? (
            <Loader showLoader={true} />
          ) : (
            <h5 id="estimatedTimeRemaining">
              Estimated Time Remaining:{" "}
              {`${estimatedTimeRemaining.hours}:${estimatedTimeRemaining.minutes}:${estimatedTimeRemaining.seconds}`}
            </h5>
          )}
        </div>
      </div>
    </div>
  );
};
