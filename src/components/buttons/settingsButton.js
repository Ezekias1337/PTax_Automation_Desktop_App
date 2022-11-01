// Library Imports
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

export const SettingsButton = ({ isAnimated }) => {
  return (
    <Link to={"/settings"}>
      <Button
        className={
          isAnimated === true
            ? "full-width-button styled-button animated-button"
            : "full-width-button styled-button"
        }
        alt="settings-button"
      >
        <FontAwesomeIcon icon={faGear} />
      </Button>
    </Link>
  );
};
