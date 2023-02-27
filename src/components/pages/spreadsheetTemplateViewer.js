// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// Constants
import { automationList } from "../../constants/automation-list/automationList";
import { spreadsheetTemplates } from "../../constants/spreadsheet-templates/allTemplates";
// Action Types
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
import { renderSelectOptions } from "../../functions/forms/renderSelectOptions";
import { camelCasifyString } from "../../utils/strings/camelCasifyString";
import { useIsFormFilled } from "../../hooks/useIsFormFilled";
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useAutomationData } from "../../hooks/ipc/useAutomationData";
// Components
import { TitleBar } from "../general-page-layout/titlebar";
import { Header } from "../general-page-layout/header";
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
import { SpreadsheetButton } from "../buttons/spreadsheetButton";
import { DownloadButton } from "../buttons/downloadButton";
import { DropDown } from "../input-fields/dropdown";
import { Switch } from "../input-fields/switch";
import { TextInput } from "../input-fields/textInput";
import { FileOrDirectoryPicker } from "../input-fields/fileOrDirectoryPicker";
// CSS
import "../../css/styles.scss";
// window.require Imports
const { ipcRenderer } = window.require("electron");

export const SpreadsheetTemplateViewer = () => {
  const state = useSelector((state) => state);
  usePersistentSettings();
  useAnimatedBackground();

  const [downloadOptions, setDownloadOptions] = useState({
    automation: "",
    fileName: "",
    downloadDirectory: "",
  });
  const [selectedSpreadsheetData, setSelectedSpreadsheetData] = useState([]);
  const [formReady, setFormReady] = useState(false);
  useIsFormFilled(downloadOptions, setFormReady);

  useEffect(() => {
    if (downloadOptions.automation !== "") {
      setSelectedSpreadsheetData(
        spreadsheetTemplates[camelCasifyString(downloadOptions.automation)]
      );
    }
  }, [downloadOptions.automation]);

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
        <Header pageTitle="Spreadsheet Templates" includeArrow={false} />

        <div className="row mx-1 mt-2">
          <DropDown
            isSettingsDropdown={false}
            data={{ name: "Automation" }}
            state={null}
            setStateHook={setDownloadOptions}
            availableChoices={renderSelectOptions(
              Object.values(automationList)
            )}
          />
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
          <div
            className="col col-6 mt-2"
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "end",
            }}
          >
            <DownloadButton
              downloadOptions={downloadOptions}
              enabled={formReady}
              isFullSize={false}
            />
          </div>
        </div>

        <div className="row mx-1 mt-2">
          <SpreadsheetPreviewer spreadSheetData={selectedSpreadsheetData} />
        </div>
      </div>
    </div>
  );
};
