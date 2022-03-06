import "../css/vanilla_css/styles.css";
import { listOfSettings } from "../data/listOfSettings";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const Settings = () => {
  //console.log(store.get(userSettings.theme))
  const arrayOfSettings = [];
  for (const item of Object.entries(listOfSettings)) {
    console.log(item[1].name);
    arrayOfSettings.push(
      <div className="col col-6 mt-2">
        <Button className="select-automation-button">{item[1].name}</Button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">{arrayOfSettings}</div>
      <div className="row">
        <div className="col col-12 mt-5">
          <Link to={"/"}>
            <Button>
            <FontAwesomeIcon icon={faHouse} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
