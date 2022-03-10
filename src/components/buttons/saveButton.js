import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";

export const SaveButton = (onClickHandler) => {
  return (
    <Button
      className="full-width-button brown-button"
      onClick={
        onClickHandler !== undefined ? onClickHandler.onClickHandler : null
      }
      alt="save-button"
    >
      <FontAwesomeIcon icon={faFloppyDisk} />
    </Button>
  );
};
