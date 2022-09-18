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
import { renderAutomationFields } from "../functions/renderInputFields/renderAutomationFields";
import { listOfAutomationsArrayExport as listOfAutomations } from "../data/listOfAutomations";
import "../css/sass_css/styles.scss";
import "../css/sass_css/automation.scss";

export const Automation = ({ automationName, preOperationQuestions }) => {
  const state = useSelector((state) => state);
  const [arrayOfPreOperationQuestions, setArrayOfPreOperationQuestions] =
    useState([]);

  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();

    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, [automationName]);

  /* 
    Parse through the preOperationQuestions
  */

  useEffect(() => {}, []);

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
              {renderAutomationFields(preOperationQuestions, listOfAutomations)}
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
