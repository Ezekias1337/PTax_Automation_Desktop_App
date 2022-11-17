// Library Imports
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export const DownloadButton = ({ isAnimated = false }) => {
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
