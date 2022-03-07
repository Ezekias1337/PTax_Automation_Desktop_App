import "../css/vanilla_css/styles.css";
import { listOfAutomationsArrayExport } from "../data/listOfAutomations";
import { Button } from "reactstrap";
import { HomeButton } from "./buttons/homeButton";
import { Link } from "react-router-dom";

export const SelectAnAutomation = () => {
  const arrayOfAutomations = [];

  for (const item of listOfAutomationsArrayExport) {
    arrayOfAutomations.push(
      <div key={item.key} className="col col-6 mt-3">
        <Link to={`/${item.name.split(" ").join("-").toLowerCase()}`}>
          <Button className="select-automation-button">{item.name}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-fluid" data-theme="dark">
      <div className="row">{arrayOfAutomations}</div>
      <div className="row">
        <div className="col col-12 mt-5">
          <HomeButton></HomeButton>
        </div>
      </div>
    </div>
  );
};
