// Library Imports
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
// window.require Imports
const { ipcRenderer } = window.require("electron");

export const DownloadButton = ({ isAnimated = false, data }) => {
  return (
    <Button
      className={
        isAnimated === true
          ? "full-width-button styled-button animated-button"
          : "full-width-button styled-button"
      }
      alt="settings-button"
    >
      <FontAwesomeIcon icon={faDownload} size="xl" />
    </Button>
  );
};
