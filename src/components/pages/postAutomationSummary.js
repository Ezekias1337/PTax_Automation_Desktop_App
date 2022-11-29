// Library Imports
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
//Redux
import { SELECT_SPREADSHEET } from "../../redux/actionCreators/spreadsheetCreators";
import {
  COMPLETED_ITERATIONS,
  CANCELLED_ITERATIONS,
  FAILED_ITERATIONS,
} from "../../redux/actionCreators/automationCreators";
// Functions, Helpers, Utils, and Hooks
import { renderPostAutomationSummaryCard } from "../../functions/automation/renderPostAutomationSummaryCard";
import { animateGradientBackground } from "../../helpers/animateGradientBackground";
import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useResetRedux } from "../../hooks/useResetRedux";
import { useIsFormFilled } from "../../hooks/useIsFormFilled";
import { useSpreadsheetData } from "../../hooks/ipc/useSpreadsheetData";
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

  const completedIterations = automationState.contents[COMPLETED_ITERATIONS];
  const failedIterations = automationState.contents[FAILED_ITERATIONS];
  const cancelledIterations = automationState.contents[CANCELLED_ITERATIONS];

  const [numberOfCompletedIterations, setNumberOfCompletedIterations] =
    useState(false);
  const [numberOfFailedIterations, setNumberOfFailedIterations] =
    useState(false);
  const [numberOfCancelledIterations, setNumberOfCancelledIterations] =
    useState(false);
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

  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();
    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, []);

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
    let tempCompletedIterations = 0;
    let tempCancelledIterations = 0;
    let tempFailedIterations = 0;

    if (completedIterations?.length) {
      tempCompletedIterations = completedIterations.length;
    }
    if (failedIterations?.length) {
      tempFailedIterations = failedIterations.length;
    }
    if (cancelledIterations?.length) {
      tempCancelledIterations = cancelledIterations.length;
    }

    setNumberOfCompletedIterations(tempCompletedIterations);
    setNumberOfCancelledIterations(tempCancelledIterations);
    setNumberOfFailedIterations(tempFailedIterations);
  }, [completedIterations, failedIterations, cancelledIterations]);

  /* 
    When the user changes the filters for what iterations they want to download,
    update the downloadOptions.arrayOfSheets array
    
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
      tempArrayOfSheets.push({
        sheetName: "Cancelled Iterations",
        data: cancelledIterations,
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
              enabled={formReady}
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
