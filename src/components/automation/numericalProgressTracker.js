import "../../css/sass_css/numerical-progress-tracker.scss";

export const NumericalProgressTracker = ({
  currentOperation = 52,
  maxNumberOfOperations = 105,
}) => {
  return (
    <div className="container" id="numericalProgressTrackerWrapper">
      <div className="row">
        <div className="col col-12">
          <h4 id="numericalProgressTracker">
            Working on {currentOperation}/{maxNumberOfOperations}
          </h4>
        </div>
      </div>
    </div>
  );
};
