// Library Imports
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
//Redux
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
// Components
import { TitleBar } from "../general-page-layout/titlebar";
import { Header } from "../general-page-layout/header";
import { Card } from "../card/card";
import { GeneralAlert } from "../alert/generalAlert";
import { SpreadsheetButton } from "../buttons/spreadsheetButton";
import { DownloadButton } from "../buttons/downloadButton";
import { SpreadsheetPreviewer } from "../spreadsheet-previewer/spreadsheetPreviewer";

// CSS
import "../../css/styles.scss";

export const PostAutomationSummary = () => {
  usePersistentSettings();
  useResetRedux();

  const state = useSelector((state) => state);
  const automationState = state.automation;

  const [numberOfCompletedIterations, setNumberOfCompletedIterations] =
    useState(false);
  const [numberOfFailedIterations, setNumberOfFailedIterations] =
    useState(false);
  const [numberOfUncompletedIterations, setNumberOfUncompletedIterations] =
    useState(false);

  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();
    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, []);

  /* 
    Find the length of the successful, failed, and uncompleted iterations,
    and set the value in the state
  */
  useEffect(() => {
    const tempCompletedIterations =
      automationState.contents[COMPLETED_ITERATIONS]?.length;
    const tempUncompletedIterations =
      automationState.contents[CANCELLED_ITERATIONS]?.length;
    const tempFailedIterations =
      automationState.contents[FAILED_ITERATIONS]?.length;

    setNumberOfCompletedIterations(tempCompletedIterations);
    setNumberOfUncompletedIterations(tempUncompletedIterations);
    setNumberOfFailedIterations(tempFailedIterations);
  }, [automationState.contents]);

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
                numberOfCompletedIterations,
                numberOfFailedIterations,
                numberOfUncompletedIterations
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
          <div className="col col-4 full-flex">
            <h3>Completed Iterations</h3>
          </div>
          <div className="col col-4 full-flex">
            <h3>Cancelled Iterations</h3>
          </div>
          <div className="col col-4 full-flex">
            <h3>Failed Iterations</h3>
          </div>
        </div>
        <div className="row mx-1 mt-2">
          <div
            id="completed-iterations-wrapper"
            className="col col-4 full-flex"
          >
            <SpreadsheetButton />
            <DownloadButton />
          </div>
          <div
            id="unattempted-iterations-wrapper"
            className="col col-4 full-flex"
          >
            <SpreadsheetButton />
            <DownloadButton />
          </div>
          <div id="failed-iterations-wrapper" className="col col-4 full-flex">
            <SpreadsheetButton />
            <DownloadButton />
          </div>
        </div>
        <div
          id="post-automation-spreadsheet-previewer"
          className="row mx-1 mt-2"
        >
          <SpreadsheetPreviewer spreadSheetData={[]} />
        </div>
      </div>
    </div>
  );
};
