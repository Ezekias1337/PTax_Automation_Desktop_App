// Library Imports
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

export const HomeButton = () => {
  return (
    <Link to={"/home"}>
      <Button className="styled-button" alt="home-button">
        <FontAwesomeIcon icon={faHouse} />
      </Button>
    </Link>
  );
};
