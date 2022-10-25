import { TitleBar } from "./titlebar";
import { Header } from "./header";
import { animateGradientBackground } from "../functions/animateGradientBackground";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EventLog } from "./eventLog";
import { ProgressBar } from "./progressBar";
import { NumericalProgressTracker } from "./numericalProgressTracker";
import { TimeTracker } from "./timeTracker";
import { Loader } from "./loader";
import { CascadingInputs } from "./inputFields/cascadingInputs";
import { StartAutomationButton } from "./buttons/startAutomationButton";
import { camelCasifyString } from "../utils/camelCasifyString";
import { listOfAutomations } from "../data/listOfAutomations";
import "../css/sass_css/styles.scss";
import "../css/sass_css/automation.scss";
const { ipcRenderer } = window.require("electron");

export const Automation = ({ automationName, preOperationQuestions }) => {
  const state = useSelector((state) => state);
  const [arrayOfDropdownQuestions, setArrayOfDropdownQuestions] = useState([]);
  const [selectedChoices, setSelectedChoices] = useState({
    automation: automationName,
  });
  const [parentChoices, setParentChoices] = useState([]);
  const [childrenChoices, setChildrenChoices] = useState([]);
  const [nonDropdownChoices, setNonDropdownChoices] = useState([]);

  /* 
    Handle theme preferences
  */

  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();

    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, [automationName]);

  /* 
    Get the list of questions that require a dropdown
  */

  useEffect(() => {
    let tempArrayOfDropdownQuestions = [];
    for (const question of preOperationQuestions) {
      if (question.inputType === "Dropdown") {
        tempArrayOfDropdownQuestions.push(question);
      }
    }

    setArrayOfDropdownQuestions(tempArrayOfDropdownQuestions);
  }, [preOperationQuestions]);

  /* 
    Get the list of parentChoices that should change
    the children upon updating
  */

  useEffect(() => {
    let tempParentChoices = [];

    for (const item of preOperationQuestions) {
      if (
        (item?.parentQuestions === null || item?.parentQuestions?.length > 0) &&
        item?.inputType === "Dropdown"
      ) {
        tempParentChoices.push(item);
      }
    }

    setParentChoices(tempParentChoices);
  }, [setParentChoices, preOperationQuestions]);

  /* 
    Get the list of choices that don't use a dropdown
    element
  */

  useEffect(() => {
    let tempNonDropdownChoices = [];

    for (const item of preOperationQuestions) {
      if (item?.inputType !== "Dropdown") {
        tempNonDropdownChoices.push(item);
      }
    }

    setNonDropdownChoices(tempNonDropdownChoices);
  }, [setNonDropdownChoices, preOperationQuestions]);

  /* 
    Get the list of selectedChoices that should change
    when a parent is updated
  */

  useEffect(() => {
    let tempChildrenChoices = [];

    for (const item of preOperationQuestions) {
      if (item?.parentQuestions !== null && item?.inputType === "Dropdown") {
        tempChildrenChoices.push(item);
      }
    }

    setChildrenChoices(tempChildrenChoices);
  }, [setChildrenChoices, preOperationQuestions]);

  /* 
    Start the IPC bridge
  */

  useEffect(() => {
    ipcRenderer.send("startIpcBusBroker", null);
  }, []);

  return (
    <div
      className="automation"
      id="element-to-animate"
      data-theme={state.settings.colorTheme}
    >
      <TitleBar />
      <Header pageTitle={automationName} />

      <div className="container-for-scroll">
        <NumericalProgressTracker />
        <ProgressBar />
        <Loader />
        <TimeTracker />
        <div className="row mx-1">
          <div className="col col-6 mt-2">
            <div className="row">
              <CascadingInputs
                arrayOfQuestions={arrayOfDropdownQuestions}
                reduxState={state}
                parentState={selectedChoices}
                setStateHook={setSelectedChoices}
                parentChoices={parentChoices}
                childrenChoices={childrenChoices}
                nonDropdownChoices={nonDropdownChoices}
                optionObj={listOfAutomations[camelCasifyString(automationName)]}
              />
            </div>
            <StartAutomationButton automationConfigObject={selectedChoices} />
          </div>
          <div className="col col-6 mt-2">
            <EventLog></EventLog>
          </div>
        </div>
      </div>
    </div>
  );
};
