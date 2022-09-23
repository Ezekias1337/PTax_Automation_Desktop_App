import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";

export const startAutomationButton = () => {
  return (
    <Button
      className="styled-button mx-2"
      onClick={onClickHandler !== undefined ? onClickHandler : null}
      alt="clipboard-button"
      id={idForButton ? idForButton : null}
    >
      <FontAwesomeIcon icon={faCirclePlay} />
    </Button>
  );
};
