import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";
import { copyTextToClipboard } from "../../utils/strings/copyTextToClipboard";

export const ClipboardButton = ({idForButton, textForClipboard}) => {
  return (
    <Button
      className="styled-button"
      onClick={() => copyTextToClipboard(textForClipboard)}
      alt="clipboard-button"
      id={idForButton ? idForButton : null}
    >
      <FontAwesomeIcon icon={faClipboard} />
    </Button>
  );
};
