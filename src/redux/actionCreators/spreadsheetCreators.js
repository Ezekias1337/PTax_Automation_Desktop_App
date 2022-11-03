// Constants
const typeBase = "spreadsheet/";
// Action Types
export const READ_SPREADSHEET = `${typeBase}READ_SPREADSHEET`;
export const READ_SPREADSHEET_LOADING_TOGGLE = `${typeBase}READ_SPREADSHEET_LOADING_TOGGLE`;
export const READ_SPREADSHEET_ERROR = `${typeBase}READ_SPREADSHEET_ERROR`;

export const readSpreadsheet = (spreadsheetContents) => {
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

export const readSpreadsheetLoadingToggle = (boolean) => {
  return (dispatch) => {
    dispatch({
      type: READ_SPREADSHEET_LOADING_TOGGLE,
      payload: boolean,
    });
  };
};

export const readSpreadsheetError = (error) => {
  return (dispatch) => {
    dispatch({
      type: READ_SPREADSHEET_ERROR,
      payload: error,
    });
  };
};
