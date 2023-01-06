// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//Redux
import {
  SELECT_SPREADSHEET,
  SAVE_SPREADSHEET,
} from "../../redux/actionCreators/spreadsheetCreators";
import {
  COMPLETED_ITERATIONS,
  CANCELLED_ITERATIONS,
  FAILED_ITERATIONS,
} from "../../redux/actionCreators/automationCreators";
// Functions, Helpers, Utils, and Hooks
import { renderPostAutomationSummaryCard } from "../../functions/automation/renderPostAutomationSummaryCard";
import { showToast } from "../../functions/toast/showToast";
import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useResetRedux } from "../../hooks/useResetRedux";
import { useIsFormFilled } from "../../hooks/useIsFormFilled";
import { useSpreadsheetData } from "../../hooks/ipc/useSpreadsheetData";
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
// Components
import { TitleBar } from "../general-page-layout/titlebar";
import { Header } from "../general-page-layout/header";
import { Card } from "../card/card";
import { SpreadsheetButton } from "../buttons/spreadsheetButton";
import { DownloadButton } from "../buttons/downloadButton";
import { SpreadsheetPreviewer } from "../spreadsheet-previewer/spreadsheetPreviewer";
import { Switch } from "../input-fields/switch";
import { TextInput } from "../input-fields/textInput";
import { FileOrDirectoryPicker } from "../input-fields/fileOrDirectoryPicker";
// CSS
import "../../css/styles.scss";

export const PostAutomationSummary = () => {
  usePersistentSettings();
  useSpreadsheetData();
  useAnimatedBackground();
  /* 
    Commenting this out for now, because I plan to experiment
    with providing the user the ability to rerun the operation
    with the previous configuration and a list of the failed,
    cancelled, or both iterations.
  
    useResetRedux(); 
  */

  const state = useSelector((state) => state);
  const automationState = state.automation;
  const spreadsheetState = state.spreadsheet.contents[SELECT_SPREADSHEET];
  const saveSpreadsheetMessages = state.spreadsheet.messages[SAVE_SPREADSHEET];

  const completedIterations = automationState.contents[COMPLETED_ITERATIONS];
  const failedIterations = automationState.contents[FAILED_ITERATIONS];
  const cancelledIterations = automationState.contents[CANCELLED_ITERATIONS];

  const [numberOfCompletedIterations, setNumberOfCompletedIterations] =
    useState(0);
  const [numberOfFailedIterations, setNumberOfFailedIterations] = useState(0);
  const [numberOfCancelledIterations, setNumberOfCancelledIterations] =
    useState(0);
  const [selectedSpreadsheetData, setSelectedSpreadsheetData] = useState([]);
  const [formReady, setFormReady] = useState(false);
  const [displaySpreadsheet, setDisplaySpreadsheet] = useState(false);
  const [downloadOptions, setDownloadOptions] = useState({
    downloadDirectory: "",
    fileName: "",
    includeCompletedIterations: true,
    includeCancelledIterations: true,
    includeFailedIterations: true,
    arrayOfSheets: [],
  });

  useIsFormFilled(downloadOptions, setFormReady);

  /* 
    When the user changes which iterations they want included,
    update the spreadsheet state for the previewer
  */

  useEffect(() => {
    if (downloadOptions.arrayOfSheets?.length > 0) {
      setSelectedSpreadsheetData(downloadOptions.arrayOfSheets);
    }
  }, [downloadOptions.arrayOfSheets]);

  /* 
    Find the length of the successful, failed, and uncompleted iterations,
    and set the value in the state
  */
  useEffect(() => {
    let tempCompletedIterationsQty = 0;
    let tempCancelledIterationsQty = 0;
    let tempFailedIterationsQty = 0;
    let tempCancelledIterations = [...cancelledIterations];

    /* 
      Check if the completed or failed arrays have any duplicates shared with
      the cancelled array
    */

    const commonElementsCompleted = [];
    const commonElementsFailed = [];

    for (const iteration of tempCancelledIterations) {
      if (
        completedIterations.some(
          (item) => item.ParcelNumber === iteration.ParcelNumber
        )
      ) {
        commonElementsCompleted.push(iteration);
      } else if (
        failedIterations.some(
          (item) => item.ParcelNumber === iteration.ParcelNumber
        )
      ) {
        commonElementsFailed.push(iteration);
      }
    }

    /* 
      If there are duplicates, subtract the length of the matches
      from the cancelled array
    */

    tempCancelledIterationsQty = cancelledIterations.length;
    if (commonElementsCompleted?.length > 0) {
      tempCancelledIterationsQty -= commonElementsCompleted.length;
    }
    if (commonElementsFailed?.length > 0) {
      tempCancelledIterationsQty -= commonElementsFailed.length;
    }

    if (completedIterations?.length) {
      tempCompletedIterationsQty = completedIterations.length;
    }
    if (failedIterations?.length) {
      tempFailedIterationsQty = failedIterations.length;
    }

    setNumberOfCompletedIterations(tempCompletedIterationsQty);
    setNumberOfCancelledIterations(tempCancelledIterationsQty);
    setNumberOfFailedIterations(tempFailedIterationsQty);
  }, [completedIterations, failedIterations, cancelledIterations]);

  /* 
    When the user changes the filters for what iterations they want to download,
    update the downloadOptions.arrayOfSheets array.
    
    Note: ESLint wants downloadOptions.arrayOfSheets to be in the 
    dependency array, but it was removed intentionally because it
    causes an infinite loop
  */

  useEffect(() => {
    const tempArrayOfSheets = [...downloadOptions.arrayOfSheets];

    if (
      downloadOptions.includeCompletedIterations === true &&
      !tempArrayOfSheets.some(
        (sheet) => sheet.sheetName === "Completed Iterations"
      )
    ) {
      tempArrayOfSheets.push({
        sheetName: "Completed Iterations",
        data: completedIterations,
      });
    } else if (downloadOptions.includeCompletedIterations === false) {
      const arrayIndexToRemove = tempArrayOfSheets.findIndex(
        (element) => element.sheetName === "Completed Iterations"
      );
      if (arrayIndexToRemove !== -1) {
        tempArrayOfSheets.splice(arrayIndexToRemove, 1);
      }
    }

    if (
      downloadOptions.includeCancelledIterations === true &&
      !tempArrayOfSheets.some(
        (sheet) => sheet.sheetName === "Cancelled Iterations"
      )
    ) {
      /* 
        Remove any duplicates that are included in cancelled and
        either the completed/failed arrays
      */

      let tempCancelledIterations = [...cancelledIterations];

      for (const [index, iteration] of tempCancelledIterations.entries()) {
        if (
          completedIterations.some(
            (item) => item.ParcelNumber === iteration.ParcelNumber
          )
        ) {
          tempCancelledIterations.splice(index, 1);
        }

        if (
          failedIterations.some(
            (item) => item.ParcelNumber === iteration.ParcelNumber
          )
        ) {
          tempCancelledIterations.splice(index, 1);
        }
      }

      tempArrayOfSheets.push({
        sheetName: "Cancelled Iterations",
        data: tempCancelledIterations,
      });
    } else if (downloadOptions.includeCancelledIterations === false) {
      const arrayIndexToRemove = tempArrayOfSheets.findIndex(
        (element) => element.sheetName === "Cancelled Iterations"
      );
      if (arrayIndexToRemove !== -1) {
        tempArrayOfSheets.splice(arrayIndexToRemove, 1);
      }
    }

    if (
      downloadOptions.includeFailedIterations === true &&
      !tempArrayOfSheets.some(
        (sheet) => sheet.sheetName === "Failed Iterations"
      )
    ) {
      tempArrayOfSheets.push({
        sheetName: "Failed Iterations",
        data: failedIterations,
      });
    } else if (downloadOptions.includeFailedIterations === false) {
      const arrayIndexToRemove = tempArrayOfSheets.findIndex(
        (element) => element.sheetName === "Failed Iterations"
      );
      if (arrayIndexToRemove !== -1) {
        tempArrayOfSheets.splice(arrayIndexToRemove, 1);
      }
    }

    setDownloadOptions({
      ...downloadOptions,
      arrayOfSheets: tempArrayOfSheets,
    });
  }, [
    downloadOptions.includeCompletedIterations,
    downloadOptions.includeCancelledIterations,
    downloadOptions.includeFailedIterations,
    completedIterations,
    cancelledIterations,
    failedIterations,
  ]);

  /* 
    Show success toast when spreadsheet saves successfully
  */

  useEffect(() => {
    let tempSaveSpreadsheetMessages = [...saveSpreadsheetMessages];

    if (tempSaveSpreadsheetMessages.slice(-1)[0] === "Download Successful") {
      showToast("Spreadsheet Saved!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [saveSpreadsheetMessages]);

  return (
    <div
      data-theme={
        state.settings.colorTheme !== undefined
          ? state.settings.colorTheme
          : "Gradient"
      }
      id="element-to-animate"
    >
      <TitleBar />

      <div className="container-for-scroll">
        <Header pageTitle="Post Automation Summary" includeArrow={false} />
        <ToastContainer
          position="bottom-center"
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
        <div className="row mx-1 mt-2">
          <div className="col col-2"></div>
          <div className="col col-8">
            <Card
              cardBody={renderPostAutomationSummaryCard(
                spreadsheetState?.data?.length,
                numberOfCompletedIterations,
                numberOfFailedIterations,
                numberOfCancelledIterations
              )}
            />
          </div>
          <div className="col col-2"></div>
        </div>
        <div className="row mx-1 mt-2">
          <div className="col col-2"></div>
          <div className="col col-8">
            <Card cardBody="Below you have the options to download or view the iterations of each category. Click the Spreadsheet button for a second time to hide the displayed spreadsheet." />
          </div>
          <div className="col col-2"></div>
        </div>

        <div className="row mx-1 mt-2">
          <TextInput
            data={{ name: "File Name" }}
            setStateHook={setDownloadOptions}
          />
          <FileOrDirectoryPicker
            data={{
              name: "Download Directory",
              customInputType: "text",
              placeholder: "C:/Users/Name/Downloads/",
            }}
            state={state}
            promptType="directory"
            setStateHook={setDownloadOptions}
            inputValueState={downloadOptions?.downloadDirectory}
            reduxStateName="downloadDirectory"
            isFullWidth={true}
          />
          <Switch
            data={{ name: "Include Completed Iterations" }}
            setStateHook={setDownloadOptions}
            nonReduxDefaultValue={true}
          />
          <Switch
            data={{ name: "Include Cancelled Iterations" }}
            setStateHook={setDownloadOptions}
            nonReduxDefaultValue={true}
          />
          <Switch
            data={{ name: "Include Failed Iterations" }}
            setStateHook={setDownloadOptions}
            nonReduxDefaultValue={true}
          />
        </div>
        <div className="row mx-1 mt-2">
          <div className="col col-6">
            <SpreadsheetButton
              spreadsheetData={downloadOptions.arrayOfSheets}
              displaySpreadsheet={displaySpreadsheet}
              setDisplaySpreadsheet={setDisplaySpreadsheet}
              enabled={true}
            />
          </div>
          <div className="col col-6">
            <DownloadButton
              downloadOptions={downloadOptions}
              enabled={formReady}
            />
          </div>
        </div>

        <div
          id="post-automation-spreadsheet-previewer"
          className="row mx-1 mt-2"
        >
          <SpreadsheetPreviewer spreadSheetData={selectedSpreadsheetData} />
        </div>
      </div>
    </div>
  );
};
