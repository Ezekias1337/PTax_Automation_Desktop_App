// Constants
const typeBase = "spreadsheet/";
// Action Types
export const READ_SPREADSHEET = `${typeBase}READ_SPREADSHEET`;
export const READ_SPREADSHEET_LOADING_TOGGLE = `${typeBase}READ_SPREADSHEET_LOADING_TOGGLE`;
export const READ_SPREADSHEET_ERROR = `${typeBase}READ_SPREADSHEET_ERROR`;
export const READ_SPREADSHEET_RESET = `${typeBase}READ_SPREADSHEET_RESET`;

export const SAVE_SPREADSHEET = `${typeBase}SAVE_SPREADSHEET`;
export const SAVE_SPREADSHEET_LOADING_TOGGLE = `${typeBase}SAVE_SPREADSHEET_LOADING_TOGGLE`;
export const SAVE_SPREADSHEET_ERROR = `${typeBase}SAVE_SPREADSHEET_ERROR`;
export const SAVE_SPREADSHEET_RESET = `${typeBase}SAVE_SPREADSHEET_RESET`;

/* 
  Although the sender paramter is unused in these action creators,
  I cannot remove the parameter, because Electron will send the event object
  instead of the contents of the message from the backend
*/

export const readSpreadsheet = (sender, spreadsheetContents) => {
  let dispatchPayload;
  if (spreadsheetContents !== null) {
    dispatchPayload = spreadsheetContents;
  } else {
    dispatchPayload = null;
  }

  return (dispatch) => {
    dispatch({
      type: READ_SPREADSHEET,
      payload: dispatchPayload,
    });
  };
};

export const readSpreadsheetLoadingToggle = (sender, boolean) => {
  return (dispatch) => {
    dispatch({
      type: READ_SPREADSHEET_LOADING_TOGGLE,
      payload: boolean,
    });
  };
};

export const readSpreadsheetError = (sender, error) => {
  return (dispatch) => {
    dispatch({
      type: READ_SPREADSHEET_ERROR,
      payload: error,
    });
  };
};

export const readSpreadsheetReset = () => {
  return (dispatch) => {
    dispatch({
      type: READ_SPREADSHEET_RESET,
      payload: null,
    });
  };
};

export const saveSpreadsheet = (sender, spreadsheetContents) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_SPREADSHEET,
      payload: spreadsheetContents,
    });
  };
};

export const saveSpreadsheetLoadingToggle = (sender, boolean) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_SPREADSHEET_LOADING_TOGGLE,
      payload: boolean,
    });
  };
};

export const saveSpreadsheetError = (sender, error) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_SPREADSHEET_ERROR,
      payload: error,
    });
  };
};

export const saveSpreadsheetReset = () => {
  return (dispatch) => {
    dispatch({
      type: SAVE_SPREADSHEET_RESET,
      payload: null,
    });
  };
};
