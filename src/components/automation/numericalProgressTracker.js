// Library Imports
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// Action Types
import { SELECT_SPREADSHEET } from "../../redux/actionCreators/spreadsheetCreators";
import { RECEIVE_ITERATION } from "../../redux/actionCreators/automationCreators";
// Functions, Helpers, Utils, and Hooks
import { useCurrentIteration } from "../../hooks/useCurrentIteration";
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

  useCurrentIteration(
    automationName,
    attributeToFindCurrentIteration,
    setAttributeToFindCurrentIteration,
    spreadsheetContents,
    automationCurrentIteration,
    setCurrentIterationNumber,
    true
  );

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
