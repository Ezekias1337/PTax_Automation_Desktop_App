// Library Imports
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
// Functions, Helpers, Utils, and Hooks
import { startAutomation } from "../../functions/automation/startAutomation";
// Components
import { Loader } from "../general-page-layout/loader";
// window.require Imports
const { ipcRenderer } = window.require("electron");

export const StartAutomationButton = ({
  automationConfigObject,
  automationStatus,
  setAutomationStatus,
  isEnabled,
  spreadsheetContents,
  setBusClientRenderer,
}) => {
  if (isEnabled === false) {
    return <></>;
  }

  return (
    <div className="row mt-5">
      <div className="col col-4"></div>
      <div className="col col-4 full-flex">
        <Button
          className={`full-width-button styled-button flex-button async-button is-loading ${
            isEnabled === true ? " " : "disabled "
          }mx-2`}
          onClick={() => {
            setAutomationStatus("In Progress");

            /*
              ! After multi-page support has been added to previewer,
              ! remove the reference to [0].data
            */
            startAutomation(
              automationConfigObject,
              spreadsheetContents.data,
              ipcRenderer,
              setBusClientRenderer
            );
          }}
          alt="clipboard-button"
          id="start-automation-button"
        >
          {automationStatus === "Idle" ? (
            <FontAwesomeIcon icon={faCirclePlay} size="2x" />
          ) : (
            <Loader showLoader={true} />
          )}
        </Button>
      </div>
      <div className="col col-4"></div>
    </div>
  );
};
