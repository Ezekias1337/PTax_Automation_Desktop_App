import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export const FirstRunAlert = (isVisible) => {
  if (isVisible.isVisible === true) {
    return (
      <div className="row mt-2">
        <div className="col col-2"></div>
        <div className="col col-8">
          <div className="alert alert-info" role="alert">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            &nbsp;Looks like this is your first time running this application.
            Click on the flashing settings button above to get started.
          </div>
        </div>
        <div className="col col-2"></div>
      </div>
    );
  } else {
    return <></>;
  }
};
