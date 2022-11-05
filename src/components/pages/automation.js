// Library Imports
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// Redux
import { actionCreators } from "../../redux/allActions";
// Functions, Helpers, Utils and Hooks
import { animateGradientBackground } from "../../helpers/animateGradientBackground";
import { camelCasifyString } from "../../utils/strings/camelCasifyString";
import { usePersistentSettings } from "../../hooks/usePersistentSettings";
// Constants
import { listOfAutomations } from "../../constants/listOfAutomations";
// Action Types
import { READ_SPREADSHEET } from "../../redux/actionCreators/spreadsheetCreators";
// Components
import { TitleBar } from "../general-page-layout/titlebar";
import { Header } from "../general-page-layout/header";
import { EventLog } from "../automation/eventLog";
import { ProgressBar } from "../automation/progressBar";
import { TimeTracker } from "../automation/timeTracker";
import { SpreadSheetExampleAndValidator } from "../automation/spreadSheetExampleAndValidator";
import { SpreadsheetPreviewer } from "../spreadsheet-previewer/spreadsheetPreviewer";
import { NumericalProgressTracker } from "../automation/numericalProgressTracker";
import { Loader } from "../general-page-layout/loader";
import { CascadingInputs } from "../input-fields/cascadingInputs";
import { StartAutomationButton } from "../buttons/startAutomationButton";
import { Card } from "../card/card";
// CSS
import "../../css/sass_css/styles.scss";
// window.require Imports
const { ipcRenderer } = window.require("electron");

export const Automation = ({ automationName, preOperationQuestions }) => {
  const dispatch = useDispatch();
  const { readSpreadsheetReset } = bindActionCreators(
    actionCreators.spreadsheetCreators,
    dispatch
  );
  usePersistentSettings();

  const state = useSelector((state) => state);
  const spreadsheetState = useSelector((state) => state.spreadsheet);
  const spreadsheetMessages = spreadsheetState.messages[READ_SPREADSHEET];
  const spreadsheetContents = spreadsheetState.contents[READ_SPREADSHEET];
  const spreadsheetLoading = spreadsheetState.loading[READ_SPREADSHEET];
  const spreadsheetErrors = spreadsheetState.errors[READ_SPREADSHEET];

  const [arrayOfDropdownQuestions, setArrayOfDropdownQuestions] = useState([]);
  const [selectedChoices, setSelectedChoices] = useState({
    automation: automationName,
  });
  const [parentChoices, setParentChoices] = useState([]);
  const [childrenChoices, setChildrenChoices] = useState([]);
  const [nonDropdownChoices, setNonDropdownChoices] = useState([]);
  const [configCardContents, setConfigCardContents] = useState([]);
  const [automationStatus, setAutomationStatus] = useState("Idle");
  const [animationParentLeft] = useAutoAnimate();
  const [animationParentRight] = useAutoAnimate();
  const [animationParentTop] = useAutoAnimate();

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
    Update the contents of the Configuration card when the
    selected options change
  */

  useEffect(() => {
    const tempSelectedChoices = { ...selectedChoices };

    setConfigCardContents(Object.entries(tempSelectedChoices));
  }, [selectedChoices]);

  /* 
    Start the IPC bridge
  */

  useEffect(() => {
    ipcRenderer.send("startIpcBusBroker", null);
  }, []);

  /* 
    Revert the spreadsheet state in redux, so revisiting the page doesn't cause
    the toast to display unnecessarily
  */

  useEffect(() => {
    return () => {
      readSpreadsheetReset();
    };
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

      <div className="container-for-scroll" ref={animationParentTop}>
        {spreadsheetContents?.length !== 0 &&
        automationStatus === "In Progress" ? (
          <>
            <NumericalProgressTracker />
            <ProgressBar />
            <TimeTracker />
          </>
        ) : (
          <></>
        )}

        <div className="row mx-1">
          <div className="col col-6 mt-2" ref={animationParentLeft}>
            <div className="row">
              {automationStatus === "Idle" ? (
                <CascadingInputs
                  arrayOfQuestions={arrayOfDropdownQuestions}
                  reduxState={state}
                  parentState={selectedChoices}
                  setStateHook={setSelectedChoices}
                  parentChoices={parentChoices}
                  childrenChoices={childrenChoices}
                  nonDropdownChoices={nonDropdownChoices}
                  optionObj={
                    listOfAutomations[camelCasifyString(automationName)]
                  }
                />
              ) : (
                <Card
                  cardTitle="Automation Configuration"
                  cardBody={configCardContents}
                  isConfigurationCard={true}
                />
              )}
            </div>
            {spreadsheetContents?.length > 0 ? (
              <StartAutomationButton
                automationConfigObject={selectedChoices}
                automationStatus={automationStatus}
                setAutomationStatus={setAutomationStatus}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="col col-6 mt-2" ref={animationParentRight}>
            {spreadsheetContents?.length === 0 &&
            automationStatus === "Idle" ? (
              <SpreadSheetExampleAndValidator
                automationConfig={selectedChoices}
              />
            ) : (
              <></>
            )}

            {spreadsheetContents?.length !== 0 &&
            automationStatus === "Idle" ? (
              <SpreadsheetPreviewer spreadSheetData={spreadsheetContents} />
            ) : (
              <></>
            )}

            {spreadsheetContents !== undefined &&
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
