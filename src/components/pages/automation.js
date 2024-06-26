// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// Constants
import { automationList } from "../../constants/automation-list/automationList";
// Redux
import {
  READ_SPREADSHEET,
  SELECT_SPREADSHEET,
} from "../../redux/actionCreators/spreadsheetCreators";
import {
  RECEIVE_ITERATION,
  AUTOMATION_FINISHED,
  COMPLETED_ITERATIONS,
  FAILED_ITERATIONS,
} from "../../redux/actionCreators/automationCreators";
// Functions, Helpers, Utils, and Hooks
import { camelCasifyString } from "../../utils/strings/camelCasifyString";
import { useIsFormFilled } from "../../hooks/useIsFormFilled";
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useAutomationData } from "../../hooks/ipc/useAutomationData";
import { useIsComponentLoaded } from "../../hooks/useIsComponentLoaded";
// Components
import { TitleBar } from "../general-page-layout/titlebar";
import { Header } from "../general-page-layout/header";
import { Loader } from "../general-page-layout/loader";
import { EventLog } from "../automation/eventLog";
import { ProgressBar } from "../automation/progressBar";
import { TimeTracker } from "../automation/timeTracker";
import { SpreadSheetExampleAndValidator } from "../automation/spreadSheetExampleAndValidator";
import { SpreadsheetPreviewer } from "../spreadsheet-previewer/spreadsheetPreviewer";
import { NumericalProgressTracker } from "../automation/numericalProgressTracker";
import { CascadingInputs } from "../input-fields/cascadingInputs";
import { StartAutomationButton } from "../buttons/startAutomationButton";
import { StopAutomationButton } from "../buttons/stopAutomationButton";
import { Card } from "../card/card";
import { GeneralAlert } from "../alert/generalAlert";
import { ViewPostAutomationSummaryButton } from "../buttons/viewPostAutomationSummaryButton";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
// CSS
import "../../css/styles.scss";
// window.require Imports
const { ipcRenderer } = window.require("electron");

export const Automation = ({ automationName, preOperationQuestions }) => {
  usePersistentSettings();

  const state = useSelector((state) => state);
  const spreadsheetState = state.spreadsheet;
  const automationState = state.automation;

  const spreadsheetContents = spreadsheetState.contents[READ_SPREADSHEET];
  const selectedSpreadsheetContents =
    spreadsheetState.contents[SELECT_SPREADSHEET];
  const automationFinished =
    automationState.automationFinished[AUTOMATION_FINISHED];
  const currentIteration = automationState.currentIteration[RECEIVE_ITERATION];
  const chromeDriverNeedsUpdate = automationState.contents.chromeDriverNeedsUpdate;
  const chromeNotInstalled = automationState.contents.chromeNotInstalled;
  const unknownError = automationState.contents.unknownError;

  const [isLogicCompleted, setIsLogicCompleted] = useState(false);
  const [arrayOfDropdownQuestions, setArrayOfDropdownQuestions] = useState([]);
  const [selectedChoices, setSelectedChoices] = useState({
    automation: automationName,
  });
  const [formReady, setFormReady] = useState(false);
  const [automationReady, setAutomationReady] = useState(false);
  const [parentChoices, setParentChoices] = useState([]);
  const [childrenChoices, setChildrenChoices] = useState([]);
  const [nonDropdownChoices, setNonDropdownChoices] = useState([]);
  const [configCardContents, setConfigCardContents] = useState([]);
  const [automationStatus, setAutomationStatus] = useState("Idle");
  const [busClientRenderer, setBusClientRenderer] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [modalFooter, setModalFooter] = useState(<></>);

  const [animationParentLeft] = useAutoAnimate();
  const [animationParentRight] = useAutoAnimate();
  const [animationParentTop] = useAutoAnimate();

  const completedIterations = automationState.contents[COMPLETED_ITERATIONS];
  const failedIterations = automationState.contents[FAILED_ITERATIONS];

  const isComponentLoaded = useIsComponentLoaded({
    conditionsToTest: [isLogicCompleted],
    testForBoolean: true,
  });

  useAutomationData(busClientRenderer);
  useIsFormFilled(selectedChoices, setFormReady, true);
  useAnimatedBackground();
  const toggleModal = () => setShowModal(!showModal);

  /* 
    Initialize the selectedOptions object
  */

  useEffect(() => {
    let tempSelectedOptionsObj = { ...selectedChoices };

    for (const [key, value] of Object.entries(preOperationQuestions)) {
      tempSelectedOptionsObj[camelCasifyString(value.name)] = "";
    }
    setSelectedChoices(tempSelectedOptionsObj);
  }, [preOperationQuestions]);

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
    setIsLogicCompleted(true);
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
    Set the local automation status to complete if back-end sends
    the signal
  */

  useEffect(() => {
    if (automationFinished === true) {
      setAutomationStatus("Completed");
    }
  }, [automationFinished]);

  /* 
    Start the IPC bridge
  */

  useEffect(() => {
    ipcRenderer.send("startIpcBusBroker", null);
  }, []);

  /* 
    Shows the modal if user attention is needed
  */

  useEffect(() => {
    if (chromeDriverNeedsUpdate || chromeNotInstalled || unknownError !== "") {
      toggleModal();
    }
  }, [chromeDriverNeedsUpdate, chromeNotInstalled, unknownError]);

  /* 
    Updates Modal contents
  */

  useEffect(() => {
    if (chromeDriverNeedsUpdate) {
      setModalTitle("Chrome WebDriver Not Found");
      setModalBody(
        "You are currently missing the Chrome WebDriver. This is required for the application to run it's automations. Click the button below to download the latest version of the Chrome WebDriver."
      );
    } else if (chromeNotInstalled) {
      setModalTitle("Chrome Not Installed");
      setModalBody(
        "Google Chrome is currently either not installed or corrupt. Please install it and try again."
      );
    } else if (unknownError !== "") {
      setModalTitle("Unexpected Error Occurred");
      setModalBody(unknownError);
    }
  }, [chromeDriverNeedsUpdate, chromeNotInstalled, unknownError]);

  if (isComponentLoaded === false) {
    return (
      <div
        id="element-to-animate"
        data-theme={
          state.settings.colorTheme !== undefined
            ? state.settings.colorTheme
            : "Gradient"
        }
      >
        <TitleBar />
        <Header pageTitle={automationName} />
        <Loader showLoader={true} />;
      </div>
    );
  }

  return (
    <div
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
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        <Modal
          isOpen={showModal}
          toggle={toggleModal}
          size="lg"
          centered={true}
        >
          <ModalHeader toggle={toggleModal}>{modalTitle}</ModalHeader>
          <ModalBody>{modalBody}</ModalBody>
          <ModalFooter>{modalFooter}</ModalFooter>
        </Modal>

        {selectedSpreadsheetContents?.length !== 0 &&
        automationStatus === "In Progress" ? (
          <>
            <NumericalProgressTracker
              isInitializing={currentIteration === null ? true : false}
              maxNumberOfOperations={
                selectedSpreadsheetContents?.data?.length >= 1
                  ? selectedSpreadsheetContents.data.length
                  : 0
              }
              automationName={automationName}
            />
            <ProgressBar
              automationName={automationName}
              automationFinished={automationFinished}
            />
            <TimeTracker
              automationName={automationName}
              currentIteration={currentIteration}
            />
          </>
        ) : (
          <></>
        )}

        <div className="row mx-1">
          <div className="col col-12 mt-2">
            <div className="row">
              {automationStatus === "Idle" &&
              selectedSpreadsheetContents?.length === 0 ? (
                <>
                  <CascadingInputs
                    arrayOfQuestions={arrayOfDropdownQuestions}
                    reduxState={state}
                    parentState={selectedChoices}
                    setStateHook={setSelectedChoices}
                    parentChoices={parentChoices}
                    childrenChoices={childrenChoices}
                    nonDropdownChoices={nonDropdownChoices}
                    optionObj={
                      automationList[camelCasifyString(automationName)]
                    }
                  />
                  <SpreadSheetExampleAndValidator
                    automationConfig={selectedChoices}
                    formReady={formReady}
                  />
                </>
              ) : (
                <></>
              )}
              {spreadsheetContents?.length !== 0 &&
              automationStatus === "Idle" &&
              automationReady === false ? (
                <>
                  <SpreadSheetExampleAndValidator
                    automationConfig={selectedChoices}
                    formReady={formReady}
                    setStateHook={setAutomationReady}
                    automationReady={automationReady}
                    automationName={automationName}
                  />
                  <SpreadsheetPreviewer
                    spreadSheetData={spreadsheetContents}
                    isPreautomation={true}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="col col-6 mt-2" ref={animationParentLeft}>
            {/* Returns when on final step before starting automation */}
            {automationReady === true &&
            formReady === true &&
            automationStatus === "Idle" ? (
              <>
                <SpreadSheetExampleAndValidator
                  automationConfig={selectedChoices}
                  formReady={formReady}
                  automationReady={automationReady}
                  automationStatus={automationStatus}
                />
                <div className="mt-2"></div>
                <Card
                  cardBody={configCardContents}
                  isConfigurationCard={true}
                />
                <StartAutomationButton
                  automationConfigObject={selectedChoices}
                  automationStatus={automationStatus}
                  setAutomationStatus={setAutomationStatus}
                  isEnabled={formReady}
                  spreadsheetContents={selectedSpreadsheetContents}
                  setBusClientRenderer={setBusClientRenderer}
                />
              </>
            ) : (
              <></>
            )}

            {/* Returns once automation is in progress */}
            {automationReady === true &&
            formReady === true &&
            automationStatus === "In Progress" &&
            automationFinished === false ? (
              <>
                <Card
                  isStatusCard={true}
                  isInitializing={currentIteration === null ? true : false}
                  currentIterator={currentIteration}
                  iteratorTypeName="parcelNumber"
                />
                <div className="my-1"></div>
                <Card
                  cardBody={configCardContents}
                  isConfigurationCard={true}
                />
                <StopAutomationButton
                  busClientRenderer={busClientRenderer}
                  automationName={automationName}
                  allIterations={selectedSpreadsheetContents.data}
                  completedIterations={completedIterations}
                  failedIterations={failedIterations}
                  setAutomationStatus={setAutomationStatus}
                />
              </>
            ) : (
              <></>
            )}

            {/* Returns once automation is completed */}
            {automationReady === true &&
            formReady === true &&
            automationStatus === "Completed" ? (
              <div className="row">
                <div className="col col-12">
                  <GeneralAlert
                    isVisible={true}
                    colorClassName="info"
                    alertText="The automation is now done running. Click the button below to view a summary of the results"
                  ></GeneralAlert>
                </div>
                <div className="col col-4"></div>
                <div className="col col-4">
                  <ViewPostAutomationSummaryButton />
                </div>
                <div className="col col-4"></div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="col col-6 mt-2" ref={animationParentRight}>
            {automationReady === true ? (
              <EventLog
                busClientRenderer={busClientRenderer}
                automationStatus={automationStatus}
              ></EventLog>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
