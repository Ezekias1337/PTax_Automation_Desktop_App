import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";

export const SpreadsheetButton = (props) => {
  return (
    <Button
      className="styled-button mx-2"
      onClick={props.onClickHandler !== undefined ? props.onClickHandler : null}
      alt="clipboard-button"
      id={props.idForButton ? props.idForButton : null}
    >
      <FontAwesomeIcon icon={faFileExcel} />
    </Button>
  );
};
