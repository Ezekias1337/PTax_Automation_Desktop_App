import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";
import { Loader } from "../loader";
const { ipcRenderer } = window.require("electron");

export const StartAutomationButton = ({}) => {
  return (
    <div className="row mt-5">
      <div className="col col-4"></div>
      <div className="col col-4 full-flex">
        <Button
          className="full-width-button styled-button is-loading mx-2"
          onClick={() => ipcRenderer.send("launchBrowser", null)}
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
