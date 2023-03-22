// Library Imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export const GeneralAlert = ({ isVisible, colorClassName, alertText }) => {
  return (
    <div className={`row ${isVisible === true ? "mt-5" : "mt-0"}`}>
      <div className="col col-2"></div>
      <div className="col col-8">
        <div
          className={`alert alert-${colorClassName}${
            isVisible === true ? "" : " d-none"
          }`}
          role="alert"
        >
          <FontAwesomeIcon icon={faTriangleExclamation} />
          {alertText}
        </div>
      </div>
      <div className="col col-2"></div>
    </div>
  );
};
