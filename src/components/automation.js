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
import { CascadingDropdown } from "./inputFields/cascadingDropdown";
import { renderSelectOptions } from "../functions/renderInputFields/renderSelectOptions";
import { listOfAutomations } from "../data/listOfAutomations";
import "../css/sass_css/styles.scss";
import "../css/sass_css/automation.scss";
import { camelCasifyString } from "../utils/camelCasifyString";

export const Automation = ({ automationName, preOperationQuestions }) => {
  const state = useSelector((state) => state);
  const [arrayOfDropdownQuestions, setArrayOfDropdownQuestions] = useState([]);
  const [selectedChoices, setSelectedChoices] = useState({});
  const [childrenChoices, setChildrenChoices] = useState([]);

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
              <CascadingDropdown
                arrayOfQuestions={arrayOfDropdownQuestions}
                parentState={selectedChoices}
                setStateHook={setSelectedChoices}
                childrenChoices={childrenChoices}
                optionObj={listOfAutomations[camelCasifyString(automationName)]}
              />
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
