import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";

export const HomeButton = () => {
  return (
    <Link to={"/"}>
      <Button className="styled-button" alt="home-button">
        <FontAwesomeIcon icon={faHouse} />
      </Button>
    </Link>
  );
};
