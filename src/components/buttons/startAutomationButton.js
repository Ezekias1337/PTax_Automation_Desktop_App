import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Button } from "reactstrap";
import { Loader } from "../general-page-layout/loader";
import { startAutomation } from "../../functions/automation/startAutomation";
const { ipcRenderer } = window.require("electron");

export const StartAutomationButton = ({
  automationConfigObject,
  automationStatus,
  setAutomationStatus,
}) => {
  const [busClientRenderer, setBusClientRenderer] = useState(null);

  return (
    <div className="row mt-5">
      <div className="col col-4"></div>
      <div className="col col-4 full-flex">
        <Button
          className="full-width-button styled-button flex-button async-button is-loading mx-2"
          onClick={() => {
            setAutomationStatus("In Progress");
            startAutomation(
              automationConfigObject,
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
