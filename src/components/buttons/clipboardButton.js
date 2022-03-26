import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";

export const ClipboardButton = (props) => {
  return (
    <Button
      className="full-width-button brown-button"
      onClick={props.onClickHandler !== undefined ? props.onClickHandler : null}
      alt="clipboard-button"
      id={props.idForButton ? props.idForButton : null}
    >
      <FontAwesomeIcon icon={faClipboard} />
    </Button>
  );
};
