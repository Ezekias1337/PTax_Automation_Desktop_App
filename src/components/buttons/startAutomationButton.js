import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Button } from "reactstrap";
import { Loader } from "../loader";
import { startAutomation } from "../../functions/startAutomation";
const { ipcRenderer } = window.require("electron");

export const StartAutomationButton = ({ automationConfigObject }) => {
  const [busClientRenderer, setBusClientRenderer] = useState(null);

  return (
    <div className="row mt-5">
      <div className="col col-4"></div>
      <div className="col col-4 full-flex">
        <Button
          className="full-width-button styled-button is-loading mx-2"
          onClick={() =>
            startAutomation(
              automationConfigObject,
              ipcRenderer,
              setBusClientRenderer
            )
          }
          alt="clipboard-button"
          id="start-automation-button"
        >
          {/* <FontAwesomeIcon icon={faCirclePlay} /> */}
          <Loader showLoader={true} />
        </Button>
      </div>
      <div className="col col-4"></div>
    </div>
  );
};
