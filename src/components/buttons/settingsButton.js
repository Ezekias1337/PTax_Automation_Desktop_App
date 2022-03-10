import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";

export const SettingsButton = () => {
  return (
    <Link to={"/settings"}>
      <Button className="full-width-button brown-button" alt="settings-button">
        <FontAwesomeIcon icon={faGear} />
      </Button>
    </Link>
  );
};
