// CSS
import "../../css/loader.scss";

export const Loader = ({ showLoader = false }) => {
  if (showLoader === false) {
    return <></>;
  }

  return (
    <div className="container" id="loaderElement">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};
