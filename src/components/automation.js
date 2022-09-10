import { TitleBar } from "./titlebar";
import { HomeButton } from "./buttons/homeButton";
import { BackButton } from "./buttons/backButton";
import { DropDown } from "./inputFields/dropdown";
import { animateGradientBackground } from "../functions/animateGradientBackground";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EventLog } from "./eventLog";
import { ProgressBar } from "./progressBar";
import { NumericalProgressTracker } from "./numericalProgressTracker";
import { TimeTracker } from "./timeTracker";
import { Loader } from "./loader";
import { listOfAutomationsArrayExport as listOfAutomations } from "../data/listOfAutomations";
import "../css/sass_css/styles.scss";
import "../css/sass_css/automation.scss";

export const Automation = ({automationName}) => {
  const state = useSelector((state) => state);
  const [arrayOfStates, setArrayOfStates] = useState([]);
  const [arrayOfSubLocations, setArrayOfSubLocations] = useState([]);
  const [arrayOfOperations, setArrayOfOperations] = useState([]);
  const [selectedState, setSelectedState] = useState(arrayOfStates[0]);
  const [selectedSubLocation, setSelectedSubLocation] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);

  // Get list of states for dropdown
  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();
    let tempArrayOfStates = [];

    for (const item of listOfAutomations) {
      if (item?.locations && item.name === automationName) {
        for (const nestedItem of item.locations) {
          tempArrayOfStates.push(nestedItem);
        }
      }
    }
    setArrayOfStates(tempArrayOfStates);
    if (tempArrayOfStates[0]?.state !== undefined) {
      setSelectedState(tempArrayOfStates[0].state);
    }

    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, [automationName]);

  /* 
    Get list of sublocations for dropdown after choosing a state
    
    The full object needed to access the sublocation is not available
    from the dropdown's state because it stores a string of the option
    name.
    
    Therefore, we need to find the selected state in the arrayOfStates
    before finding the available sublocations
    
  */

  useLayoutEffect(() => {
    if (selectedState !== undefined && arrayOfStates !== undefined) {
      const arrayOfStatesCopy = arrayOfStates;
      const selectedStateFullData = arrayOfStatesCopy.find(
        (singleState) => singleState?.state === selectedState
      );

      const selectedStateSublocations = selectedStateFullData?.subLocations;

      if (selectedStateSublocations !== undefined) {
        setArrayOfSubLocations(selectedStateSublocations);
        console.log("selectedStateSublocations: ", selectedStateSublocations);
      }
    }
  }, [selectedState]);

  useEffect(() => {
    console.log("arrayOfSubLocations: ", arrayOfSubLocations);
  }, [arrayOfSubLocations]);

  /* 
    Get list of available operations for dropdown,
    based on the selectedSublocation 
  */

  useLayoutEffect(() => {
    let tempArrayOfOperations = [];
    for (const item of arrayOfSubLocations) {
      console.log(item);
    }
  }, [selectedSubLocation]);

  return (
    <div
      className="automation"
      id="element-to-animate"
      data-theme={state.settings.colorTheme}
    >
      <TitleBar />
      <div className="row page-title">
        <h1>{automationName}</h1>
      </div>

      <div className="container-for-scroll">
        <NumericalProgressTracker />
        <ProgressBar />
        <Loader />
        <TimeTracker />
        <div className="row mx-1">
          <div className="col col-6 mt-2">
            <div className="row">
              <div className="col col-12">
                <DropDown
                  data={arrayOfStates}
                  stateSelector={true}
                  setStateHook={setSelectedState}
                />
              </div>
              <div className="col col-12">
                <DropDown
                  data={arrayOfSubLocations}
                  stateSelector={false}
                  subLocationSelector={true}
                  setStateHook={setSelectedSubLocation}
                />
              </div>
              {/* <div className="col col-12">
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
