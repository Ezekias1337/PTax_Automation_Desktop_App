import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";

export const SpreadsheetButton = ({ idForButton, onClickHandler }) => {
  return (
    <Button
      className="styled-button mx-2"
      onClick={onClickHandler !== undefined ? onClickHandler : null}
      alt="clipboard-button"
      id={idForButton ? idForButton : null}
    >
      <FontAwesomeIcon icon={faFileExcel} />
    </Button>
  );
};
