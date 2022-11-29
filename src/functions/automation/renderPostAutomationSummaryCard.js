// Library Imports
import { nanoid } from "nanoid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";
// Functions, Helpers, Utils, and Hooks
import { roundDecimal } from "../../utils/numbers/roundDecimal";

export const renderPostAutomationSummaryCard = (
  totalIterations,
  numberOfCompletedIterations,
  numberOfFailedIterations,
  numberOfCancelledIterations
) => {
  let completedRate,
    completedPercentage,
    failedRate,
    failedPercentage,
    cancelledRate,
    cancelledPercentage,
    finalTotalIterations;

  if (totalIterations !== undefined) {
    /* 
    Determine the % of completedIterations relative to all iterations
  */
    completedRate = numberOfCompletedIterations / totalIterations;
    completedPercentage = roundDecimal(completedRate * 100);
    /* 
    Determine the % of failedIterations relative to all iterations
  */
    failedRate = numberOfFailedIterations / totalIterations;
    failedPercentage = roundDecimal(failedRate * 100);
    /* 
    Determine the % of cancelledIterations relative to all iterations
  */
    cancelledRate = numberOfCancelledIterations / totalIterations;
    cancelledPercentage = roundDecimal(cancelledRate * 100);

    finalTotalIterations = totalIterations;
    
    console.log("cancelledRate: ", cancelledRate);
    console.log("cancelledPercentage: ", cancelledPercentage);
    console.log("finalTotalIterations: ", finalTotalIterations);
  } else {
    completedRate =
      completedPercentage =
      failedRate =
      failedPercentage =
      cancelledRate =
      cancelledPercentage =
      finalTotalIterations =
        0;
  }

  /* 
    finalTotalIterations is just used so that when the page reloads
    in development mode you don't get an error for the redux state
    being undefined
  */

  return (
    <>
      <div key={nanoid()} className="row card-body-row display-flex my-4">
        <div className="col col-6 completed-icon">
          <FontAwesomeIcon icon={faThumbsUp} />
          <b>Completed Iterations:</b>
          {` ${numberOfCompletedIterations}/${finalTotalIterations}`}
        </div>
        <div className="col col-6 completed-icon">
          <FontAwesomeIcon icon={faThumbsUp} />
          <b>Completion Percentage:</b>
          {` ${isNaN(completedPercentage) ? "0" : completedPercentage}%`}
        </div>
      </div>
      <div key={nanoid()} className="row card-body-row display-flex my-4">
        <div className="col col-6 cancelled-icon">
          <FontAwesomeIcon icon={faChartPie} />
          <b>Cancelled Iterations:</b>
          {` ${numberOfCancelledIterations}/${finalTotalIterations}`}
        </div>
        <div className="col col-6 cancelled-icon">
          <FontAwesomeIcon icon={faChartPie} />
          <b>Cancelled Percentage:</b>
          {` ${isNaN(cancelledPercentage) ? "0" : cancelledPercentage}%`}
        </div>
      </div>
      <div key={nanoid()} className="row card-body-row display-flex my-4">
        <div className="col col-6 failed-icon">
          <FontAwesomeIcon icon={faThumbsDown} />
          <b>Failed Iterations:</b>
          {` ${numberOfFailedIterations}/${finalTotalIterations}`}
        </div>
        <div className="col col-6 failed-icon">
          <FontAwesomeIcon icon={faThumbsDown} />
          <b>Failure Percentage:</b>
          {` ${isNaN(failedPercentage) ? "0" : failedPercentage}%`}
        </div>
      </div>
    </>
  );
};
