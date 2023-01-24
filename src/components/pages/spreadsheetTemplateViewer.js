// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// Constants
import { listOfAutomations } from "../../constants/listOfAutomations";
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
// CSS
import "../../css/styles.scss";
// window.require Imports
const { ipcRenderer } = window.require("electron");

export const SpreadsheetTemplateViewer = () => {
  const state = useSelector((state) => state);
  useAnimatedBackground();

  return (
    <div
      data-theme={
        state.settings.colorTheme !== undefined
          ? state.settings.colorTheme
          : "Gradient"
      }
      id="element-to-animate"
    ></div>
  );
};
