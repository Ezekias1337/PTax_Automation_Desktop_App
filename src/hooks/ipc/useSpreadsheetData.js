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
  const { readSpreadsheet } = bindActionCreators(
    actionCreators.spreadsheetCreators,
    dispatch
  );

  useEffect(() => {
    const handleIpcTest = (event, message) => {
      readSpreadsheet(message);
    };

    ipcRenderer.on("spreadsheetParsed", handleIpcTest);

    return () => {
      ipcRenderer.removeListener("spreadsheetParsed", handleIpcTest);
    };
  }, [readSpreadsheet]);
};
