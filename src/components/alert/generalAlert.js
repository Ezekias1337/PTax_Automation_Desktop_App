import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

export const GeneralAlert = (props) => {
  return (
    <div className={`row ${props.isVisible === true ? "mt-2" : "mt-0"}`}>
      <div className="col col-2"></div>
      <div className="col col-8">
        <div
          id={props.id}
          className={`alert ${props.colorClassName}${
            props.isVisible === true ? "" : " d-none"
          }`}
          role="alert"
        >
          <FontAwesomeIcon icon={faTriangleExclamation} />
          {props.string}
        </div>
      </div>
      <div className="col col-2"></div>
    </div>
  );
};
