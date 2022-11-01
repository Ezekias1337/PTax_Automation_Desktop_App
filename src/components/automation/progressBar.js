// CSS
import "../../css/sass_css/progress-bar.scss";

export const ProgressBar = ({ width = 100 }) => {
  return (
    <div className="container mx-auto" id="progressBarWrapper">
      <div id="progressBar"></div>
      <div id="progressBarFrostEffect"></div>
      <h5 id="progressPercentage">50%</h5>
    </div>
  );
};
