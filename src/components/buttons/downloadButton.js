// Library Imports
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
// window.require Imports
const { ipcRenderer } = window.require("electron");

/* 
  On click handler needs to send "spreadsheet save" to IPC to
  trigger the download
*/

export const DownloadButton = ({
  isAnimated = false,
  downloadOptions,
  enabled,
}) => {
  return (
    <Button
      className={`full-width-button styled-button${
        enabled === false ? " disabled" : ""
      }`}
      alt="settings-button"
      onClick={() => ipcRenderer.send("save spreadsheet", downloadOptions)}
    >
      <FontAwesomeIcon icon={faDownload} size="xl" />
    </Button>
  );
};
