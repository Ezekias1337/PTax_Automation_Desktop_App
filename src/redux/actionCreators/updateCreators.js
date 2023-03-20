// Constants
const typeBase = "update/";
// Action Types

export const CHECK_FOR_UPDATE_PENDING = `${typeBase}CHECK_FOR_UPDATE_PENDING`;
export const CHECK_FOR_UPDATE_SUCCESS = `${typeBase}CHECK_FOR_UPDATE_SUCCESS`;
export const CHECK_FOR_UPDATE_FAILURE = `${typeBase}CHECK_FOR_UPDATE_FAILURE`;

export const DOWNLOAD_UPDATE_PENDING = `${typeBase}DOWNLOAD_UPDATE_PENDING`;
export const DOWNLOAD_UPDATE_SUCCESS = `${typeBase}DOWNLOAD_UPDATE_SUCCESS`;
export const DOWNLOAD_UPDATE_FAILURE = `${typeBase}DOWNLOAD_UPDATE_FAILURE`;

export const checkForUpdatePending = (status) => {
  return (dispatch) => {
    dispatch({
      type: CHECK_FOR_UPDATE_PENDING,
      payload: status,
    });
  };
};

export const checkForUpdateSuccess = (status) => {
  return (dispatch) => {
    dispatch({
      type: CHECK_FOR_UPDATE_SUCCESS,
      payload: status,
    });
  };
};

export const checkForUpdateFailure = (status) => {
  return (dispatch) => {
    dispatch({
      type: CHECK_FOR_UPDATE_FAILURE,
      payload: status,
    });
  };
};

export const downloadUpdatePending = (status) => {
  return (dispatch) => {
    dispatch({
      type: DOWNLOAD_UPDATE_PENDING,
      payload: status,
    });
  };
};

export const downloadUpdateSuccess = (status) => {
  return (dispatch) => {
    dispatch({
      type: DOWNLOAD_UPDATE_SUCCESS,
      payload: status,
    });
  };
};

export const downloadUpdateFailure = (status) => {
  return (dispatch) => {
    dispatch({
      type: DOWNLOAD_UPDATE_FAILURE,
      payload: status,
    });
  };
};
