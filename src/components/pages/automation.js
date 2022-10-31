import { TitleBar } from "../general-page-layout/titlebar";
import { Header } from "../general-page-layout/header";
import { animateGradientBackground } from "../../helpers/animateGradientBackground";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { EventLog } from "../automation/eventLog";
import { ProgressBar } from "../automation/progressBar";
import { NumericalProgressTracker } from "../automation/numericalProgressTracker";
import { TimeTracker } from "../automation/timeTracker";
import { Loader } from "../general-page-layout/loader";
import { CascadingInputs } from "../input-fields/cascadingInputs";
import { StartAutomationButton } from "../buttons/startAutomationButton";
import { SpreadsheetPreviewer } from "../automation/spreadsheetPreviewer";
import { camelCasifyString } from "../../utils/strings/camelCasifyString";
import { listOfAutomations } from "../../constants/listOfAutomations";
import "../../css/sass_css/styles.scss";
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
  const [spreadsheetData, setSpreadsheetData] = useState([]);
  const [automationStatus, setAutomationStatus] = useState("Idle");
  const [animationParent] = useAutoAnimate();

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
      data-theme={
        state.settings.colorTheme !== undefined
          ? state.settings.colorTheme
          : "Gradient"
      }
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
          <div className="col col-6 mt-2" ref={animationParent}>
            {spreadsheetData === undefined && automationStatus === "Idle" ? (
              <></>
            ) : (
              <></>
            )}

            {spreadsheetData !== undefined && automationStatus === "Idle" ? (
              <SpreadsheetPreviewer
                spreadSheetData={[
                  {
                    parcelNumber: "1-234-5671",
                    locationName: "101 Montgomery",
                  },
                  {
                    parcelNumber: "1-234-5672",
                    locationName: "102 Montgomery",
                  },
                  {
                    parcelNumber: "1-234-5673",
                    locationName: "103 Montgomery",
                  },
                  {
                    parcelNumber: "1-234-5674",
                    locationName: "104 Montgomery",
                  },
                  {
                    parcelNumber: "1-234-5675",
                    locationName: "105 Montgomery",
                  },
                  {
                    parcelNumber: "1-234-5676",
                    locationName: "106 Montgomery",
                  },
                ]}
              />
            ) : (
              <></>
            )}

            {spreadsheetData !== undefined &&
            automationStatus === "In Progress" ? (
              <EventLog></EventLog>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
