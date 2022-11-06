// CSS
import "../../css/time-tracker.scss";

export const TimeTracker = ({
  timeElapsed = "0:50",
  estimatedTimeRemaining = "0:52",
}) => {
  return (
    <div className="container mt-1" id="timeTrackerWrapper">
      <div className="row">
        <div className="col col-12 col-md-6">
          <h5 id="timeElapsed">Time Elapsed: {timeElapsed}</h5>
        </div>
        <div className="col col-12 col-md-6">
          <h5 id="estimatedTimeRemaining">
            Estimated Time Remaining: {estimatedTimeRemaining}
          </h5>
        </div>
      </div>
    </div>
  );
};
