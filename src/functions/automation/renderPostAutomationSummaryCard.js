// Library Imports
import { nanoid } from "nanoid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp,
  faThumbsDown,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";

export const renderPostAutomationSummaryCard = (
  totalIterations,
  numberOfCompletedIterations,
  numberOfFailedIterations,
  numberOfCancelledIterations
) => {
  /* 
    Determine the % of completedIterations relative to all iterations
  */
  const completedRate = numberOfCompletedIterations / totalIterations;
  const completedPercentage = completedRate * 100;
  /* 
    Determine the % of failedIterations relative to all iterations
  */
  const failedRate = numberOfFailedIterations / totalIterations;
  const failedPercentage = failedRate * 100;
  /* 
    Determine the % of cancelledIterations relative to all iterations
  */
  const cancelledRate = numberOfCancelledIterations / totalIterations;
  const cancelledPercentage = cancelledRate * 100;

  return (
    <>
      <div key={nanoid()} className="row card-body-row display-flex my-4">
        <div className="col col-6 completed-icon">
          <FontAwesomeIcon icon={faThumbsUp} />
          <b>Completed Iterations:</b>
          {` ${numberOfCompletedIterations}/${totalIterations}`}
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
          {` ${numberOfCancelledIterations}/${totalIterations}`}
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
          {` ${numberOfFailedIterations}/${totalIterations}`}
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
