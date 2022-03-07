import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";

export const SettingsButton = () => {
  return (
    <Link to={"/settings"}>
      <Button className="mt-3">
        <FontAwesomeIcon icon={faGear} />
      </Button>
    </Link>
  );
};
