// Library Imports
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
// Redux
import { actionCreators } from "../../redux/allActions";

/* 
    Update the redux state with the spreadsheet data from the backend
*/

export const useEventLogData = (busClientRenderer) => {
  const dispatch = useDispatch();

  const { recieveEventLogData } = bindActionCreators(
    actionCreators.eventLogCreators,
    dispatch
  );

  useEffect(() => {
    if (busClientRenderer !== null) {
      busClientRenderer.on("event-log-update", recieveEventLogData);
    }

    return () => {
      if (busClientRenderer !== null) {
        busClientRenderer.removeListener(
          "event-log-update",
          recieveEventLogData
        );
      }
    };
  }, [recieveEventLogData, busClientRenderer]);
};
