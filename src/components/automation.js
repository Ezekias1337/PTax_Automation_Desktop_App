import "../css/vanilla_css/styles.css";
import "../css/vanilla_css/select-an-automation.css";
import { HomeButton } from "./buttons/homeButton";
import { BackButton } from "./buttons/backButton";
import { DropDown } from "./inputFields/dropdown";
import { animateGradientBackground } from "../functions/animateGradientBackground";
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EventLog } from "./eventLog";
import { listOfAutomationsArrayExport as listOfAutomations } from "../data/listOfAutomations";

export const Automation = (props) => {
  const state = useSelector((state) => state);
  const [arrayOfStates, setArrayOfStates] = useState([]);
  const [arrayOfSubLocations, setArrayOfSubLocations] = useState([]);
  const [arrayOfOperations, setArrayOfOperations] = useState([]);

  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();
    let tempArrayOfStates = [];

    for (const item of listOfAutomations) {
      if (item?.locations && item.name === props.automationName) {
        for (const nestedItem of item.locations) {
          tempArrayOfStates.push(nestedItem);
        }
      }
    }

    setArrayOfStates(tempArrayOfStates);

    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, []);

  return (
    <div
      className="automation container-fluid"
      id="element-to-animate"
      data-theme={state.settings.colorTheme}
    >
      <div className="row page-title">
        <h1>{props.automationName}</h1>
      </div>
      <div className="row">
        <div className="col col-6 mt-2">
          <div className="row">
            <div className="col col-12">
              <DropDown data={arrayOfStates} stateSelector={true} />
            </div>
            {/* <div className="col col-12">
              <DropDown data={arrayOfStates} stateSelector={true} />
            </div>
            <div className="col col-12">
              <DropDown data={arrayOfStates} stateSelector={true} />
            </div>
            <div className="col col-12">
              <DropDown data={arrayOfStates} stateSelector={true} />
            </div> */}
          </div>
        </div>
        <div className="col col-6 mt-2">
          <EventLog></EventLog>
        </div>
      </div>
      <div className="row">
        <div className="col col-12 mt-5">
          <BackButton></BackButton>
          <HomeButton></HomeButton>
        </div>
      </div>
    </div>
  );
};
