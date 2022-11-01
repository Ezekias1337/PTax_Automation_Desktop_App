// Library Imports
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
// Functions, Helpers, Utils, and Hooks
import { goBackOnePage } from "../../utils/window/goBackOnePage";

export const BackButton = () => {
  return (
    <Button
      className="styled-button backButton me-1"
      alt="back-button"
      onClick={() => goBackOnePage()}
    >
      <FontAwesomeIcon icon={faCircleArrowLeft} />
    </Button>
  );
};
