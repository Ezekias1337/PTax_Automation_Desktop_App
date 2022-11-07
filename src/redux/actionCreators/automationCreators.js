// Constants
const typeBase = "automation/";
// Action Types
export const RECEIVE_ITERATION = `${typeBase}RECEIVE_ITERATION`;
export const RECEIVE_ITERATION_LOADING_TOGGLE = `${typeBase}RECEIVE_ITERATION_LOADING_TOGGLE`;
export const RECEIVE_ITERATION_ERROR = `${typeBase}RECEIVE_ITERATION_ERROR`;
export const RECEIVE_ITERATION_RESET = `${typeBase}RECEIVE_ITERATION_RESET`;

/* 
  Although the sender paramter is unused in these action creators,
  I cannot remove the parameter, because Electron will send the event object
  instead of the contents of the message from the backend
*/

export const recieveIteration = (sender, iterationData) => {
  return (dispatch) => {
    dispatch({
      type: RECEIVE_ITERATION,
      payload: iterationData,
    });
  };
};

export const receiveIterationLoadingToggle = (sender, boolean) => {
  return (dispatch) => {
    dispatch({
      type: RECEIVE_ITERATION_LOADING_TOGGLE,
      payload: boolean,
    });
  };
};

export const recieveIterationError = (sender, error) => {
  return (dispatch) => {
    dispatch({
      type: RECEIVE_ITERATION_ERROR,
      payload: error,
    });
  };
};

export const recieveIterationReset = () => {
  return (dispatch) => {
    dispatch({
      type: RECEIVE_ITERATION_RESET,
      payload: null,
    });
  };
};
