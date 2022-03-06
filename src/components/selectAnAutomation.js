import "../css/vanilla_css/styles.css";
import { listOfAutomations } from "../data/listOfAutomations";
import { Button } from "reactstrap";

export const SelectAnAutomation = () => {
  //console.log(store.get(userSettings.theme))
  const arrayOfAutomations = [];
  for (const item of Object.entries(listOfAutomations)) {
    console.log(item[1].name);
    arrayOfAutomations.push(
      <div className="col col-6 mt-2">
        <Button className="select-automation-button">{item[1].name}</Button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">{arrayOfAutomations}</div>
    </div>
  );
};
