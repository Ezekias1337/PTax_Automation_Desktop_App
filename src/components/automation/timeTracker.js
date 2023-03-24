// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useStopwatch } from "react-timer-hook";
// Functions, Helpers, Utils, and Hooks
import { useCurrentIteration } from "../../hooks/useCurrentIteration";
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

  const [currentIterationNumber, setCurrentIterationNumber] = useState(0);
  const [attributeToFindCurrentIteration, setAttributeToFindCurrentIteration] =
    useState(null);

  const { seconds, minutes, hours, start } = useStopwatch({ autoStart: false });

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
    if (
      currentIterationNumber === 1 &&
      seconds === 0 &&
      minutes === 0 &&
      hours === 0
    ) {
      start();
    }
  }, [currentIterationNumber, seconds, minutes, hours]);

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
      </div>
    </div>
  );
};
