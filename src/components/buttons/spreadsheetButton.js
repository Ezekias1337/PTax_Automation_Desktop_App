// Library Imports
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

export const SpreadsheetButton = ({
  selectedSpreadsheetData,
  setSelectedSpreadsheetData,
  newSpreadsheetData,
}) => {
  /* 
    Determine if button has been clicked
  */

  return (
    <Button
      className={`full-width-button styled-button${
        newSpreadsheetData?.length === 0 ? " disabled" : ""
      }`}
      onClick={() => {
        if (selectedSpreadsheetData === newSpreadsheetData) {
          setSelectedSpreadsheetData([]);
        } else {
          setSelectedSpreadsheetData(newSpreadsheetData);
        }
      }}
      alt="clipboard-button"
    >
      <FontAwesomeIcon icon={faFileExcel} size="xl" />
    </Button>
  );
};
