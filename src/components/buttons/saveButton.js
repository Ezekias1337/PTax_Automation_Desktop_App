import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";

export const SaveButton = ({ idForButton, onClickHandler }) => {
  return (
    <Button
      className="full-width-button styled-button"
      onClick={onClickHandler !== undefined ? onClickHandler : null}
      alt="save-button"
      id={idForButton ? idForButton : null}
    >
      <FontAwesomeIcon icon={faFloppyDisk} />
    </Button>
  );
};
