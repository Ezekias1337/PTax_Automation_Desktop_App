import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";

export const SaveButton = (props) => {
  return (
    <Button
      className="full-width-button brown-button"
      onClick={props.onClickHandler !== undefined ? props.onClickHandler : null}
      alt="save-button"
      id={props.idForButton ? props.idForButton : null}
    >
      <FontAwesomeIcon icon={faFloppyDisk} />
    </Button>
  );
};
