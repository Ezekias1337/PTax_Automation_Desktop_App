import { TitleBar } from "./titlebar";
import { HomeButton } from "./buttons/homeButton";
import { BackButton } from "./buttons/backButton";
import { DropDown } from "./inputFields/dropdown";
import { animateGradientBackground } from "../functions/animateGradientBackground";
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EventLog } from "./eventLog";
import { ProgressBar } from "./progressBar";
import { NumericalProgressTracker } from "./numericalProgressTracker";
import { listOfAutomationsArrayExport as listOfAutomations } from "../data/listOfAutomations";
import "../css/sass_css/styles.scss";
import "../css/sass_css/automation.scss";

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
    /* 
    ⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠    
      Need to notify user that they must let the script run in fullscreen
    ⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠⚠ 
*/
    setArrayOfStates(tempArrayOfStates);

    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, []);

  return (
    <div
      className="automation"
      id="element-to-animate"
      data-theme={state.settings.colorTheme}
    >
      <TitleBar />
      <div className="row page-title">
        <h1>{props.automationName}</h1>
      </div>
      <NumericalProgressTracker />
      <ProgressBar />
      <div className="container-for-scroll">
        <div className="row mx-1">
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
        <div className="row mx-1">
          <div className="col col-12 mt-5">
            <BackButton></BackButton>
            <HomeButton></HomeButton>
          </div>
        </div>
      </div>
    </div>
  );
};
