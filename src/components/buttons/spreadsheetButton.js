// Library Imports
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";

export const SpreadsheetButton = ({
  spreadsheetData,
  displaySpreadsheet,
  setDisplaySpreadsheet,
}) => {
  return (
    <Button
      className={`full-width-button styled-button${
        spreadsheetData?.length === 0 ? " disabled" : ""
      }`}
      onClick={() => {
        setDisplaySpreadsheet(!displaySpreadsheet);
        /* if (selectedSpreadsheetData === spreadsheetData) {
          setSelectedSpreadsheetData([]);
        } else {
          setSelectedSpreadsheetData(spreadsheetData);
        } */
      }}
      alt="clipboard-button"
    >
      <FontAwesomeIcon icon={faFileExcel} size="xl" />
    </Button>
  );
};
