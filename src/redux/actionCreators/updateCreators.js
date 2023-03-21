// Constants
const typeBase = "update/";
// Action Types

export const CHECK_FOR_UPDATE_PENDING = `${typeBase}CHECK_FOR_UPDATE_PENDING`;
export const CHECK_FOR_UPDATE_SUCCESS = `${typeBase}CHECK_FOR_UPDATE_SUCCESS`;
export const CHECK_FOR_UPDATE_FAILURE = `${typeBase}CHECK_FOR_UPDATE_FAILURE`;

export const DOWNLOAD_UPDATE_PENDING = `${typeBase}DOWNLOAD_UPDATE_PENDING`;
export const DOWNLOAD_UPDATE_SUCCESS = `${typeBase}DOWNLOAD_UPDATE_SUCCESS`;
export const DOWNLOAD_UPDATE_FAILURE = `${typeBase}DOWNLOAD_UPDATE_FAILURE`;

export const checkForUpdatePending = () => {
  return (dispatch) => {
    dispatch({
      type: CHECK_FOR_UPDATE_PENDING,
      payload: true,
    });
  };
};

export const checkForUpdateSuccess = () => {
  return (dispatch) => {
    dispatch({
      type: CHECK_FOR_UPDATE_SUCCESS,
      payload: true,
    });
  };
};

export const checkForUpdateFailure = () => {
  return (dispatch) => {
    dispatch({
      type: CHECK_FOR_UPDATE_FAILURE,
      payload: true,
    });
  };
};

export const downloadUpdatePending = () => {
  return (dispatch) => {
    dispatch({
      type: DOWNLOAD_UPDATE_PENDING,
      payload: true,
    });
  };
};

export const downloadUpdateSuccess = () => {
  return (dispatch) => {
    dispatch({
      type: DOWNLOAD_UPDATE_SUCCESS,
      payload: true,
    });
  };
};

export const downloadUpdateFailure = () => {
  return (dispatch) => {
    dispatch({
      type: DOWNLOAD_UPDATE_FAILURE,
      payload: true,
    });
  };
};
