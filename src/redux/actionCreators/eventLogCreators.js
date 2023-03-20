// Constants
const typeBase = "event-log/";
// Action Types
export const RECEIVE_EVENT_LOG_DATA = `${typeBase}RECEIVE_EVENT_LOG_DATA`;
export const RECEIVE_EVENT_LOG_DATA_LOADING_TOGGLE = `${typeBase}RECEIVE_EVENT_LOG_DATA_LOADING_TOGGLE`;
export const RECEIVE_EVENT_LOG_DATA_ERROR = `${typeBase}RECEIVE_EVENT_LOG_DATA_ERROR`;
export const RECEIVE_EVENT_LOG_DATA_RESET = `${typeBase}RECEIVE_EVENT_LOG_DATA_RESET`;

/* 
  Although the sender parameter is unused in these action creators,
  I cannot remove the parameter, because Electron will send the event object
  instead of the contents of the message from the backend
*/

export const recieveEventLogData = (sender, iterationData) => {
  return (dispatch) => {
    dispatch({
      type: RECEIVE_EVENT_LOG_DATA,
      payload: iterationData,
    });
  };
};

export const recieveEventLogDataLoadingToggle = (sender, boolean) => {
  return (dispatch) => {
    dispatch({
      type: RECEIVE_EVENT_LOG_DATA_LOADING_TOGGLE,
      payload: boolean,
    });
  };
};

export const recieveEventLogError = (sender, error) => {
  return (dispatch) => {
    dispatch({
      type: RECEIVE_EVENT_LOG_DATA_ERROR,
      payload: error,
    });
  };
};

export const recieveEventLogReset = () => {
  return (dispatch) => {
    dispatch({
      type: RECEIVE_EVENT_LOG_DATA_RESET,
      payload: null,
    });
  };
};
