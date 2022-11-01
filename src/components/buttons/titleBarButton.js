// Library Imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const TitleBarButton = ({
  buttonIcon,
  buttonClickHandler,
  isClose = false,
}) => {
  return (
    <button
      className={`btn title-bar-button${isClose === true ? "-close" : ""}`}
      onClick={() => buttonClickHandler()}
    >
      <FontAwesomeIcon icon={buttonIcon} />
    </button>
  );
};
