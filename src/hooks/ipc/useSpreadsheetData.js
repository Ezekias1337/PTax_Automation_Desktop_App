// Library Imports
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
// Redux
import { actionCreators } from "../../redux/allActions";
// window.require Imports
const { ipcRenderer } = window.require("electron");

/* 
    Update the redux state with the spreadsheet data from the backend
*/

export const useSpreadsheetData = () => {
  const dispatch = useDispatch();
  const { readSpreadsheet, readSpreadsheetError } = bindActionCreators(
    actionCreators.spreadsheetCreators,
    dispatch
  );

  useEffect(() => {
    ipcRenderer.on("spreadsheet parsed", readSpreadsheet);
    ipcRenderer.on("spreadsheet parse failed", readSpreadsheetError);

    return () => {
      ipcRenderer.removeListener("spreadsheet parsed", readSpreadsheet);
      ipcRenderer.removeListener(
        "spreadsheet parse failed",
        readSpreadsheetError
      );
    };
  }, [readSpreadsheet, readSpreadsheetError]);
};
