// Library Imports
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
// Redux
import { actionCreators } from "../redux/allActions";

/* 
    Revert the state in redux when leaving the page
    
    ESLINT wants a dependancy array here, but it causes an infinite loop,
    so it is not included intentionally
  */

export const useResetRedux = () => {
  const dispatch = useDispatch();

  const { readSpreadsheetReset, selectSpreadsheetReset } = bindActionCreators(
    actionCreators.spreadsheetCreators,
    dispatch
  );
  const { recieveIterationReset } = bindActionCreators(
    actionCreators.automationCreators,
    dispatch
  );
  const { recieveEventLogReset } = bindActionCreators(
    actionCreators.eventLogCreators,
    dispatch
  );

  useEffect(() => {
    return () => {
      readSpreadsheetReset();
      selectSpreadsheetReset();
      recieveIterationReset();
      recieveEventLogReset();
    };
  }, []);
};
