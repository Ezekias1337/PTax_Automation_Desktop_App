import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";

const goBackOnePage = () => {
  window.history.back();
};

export const BackButton = () => {
  return (
    <Button
      className="brown-button backButton me-1"
      alt="back-button"
      onClick={() => goBackOnePage()}
    >
      <FontAwesomeIcon icon={faCircleArrowLeft} />
    </Button>
  );
};
