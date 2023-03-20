// Constants
const typeBase = "automation/";
// Action Types
export const RECEIVE_ITERATION = `${typeBase}RECEIVE_ITERATION`;
export const RECEIVE_ITERATION_LOADING_TOGGLE = `${typeBase}RECEIVE_ITERATION_LOADING_TOGGLE`;
export const RECEIVE_ITERATION_ERROR = `${typeBase}RECEIVE_ITERATION_ERROR`;
export const RECEIVE_ITERATION_RESET = `${typeBase}RECEIVE_ITERATION_RESET`;

export const COMPLETED_ITERATIONS = `${typeBase}COMPLETED_ITERATIONS`;
export const CANCELLED_ITERATIONS = `${typeBase}CANCELLED_ITERATIONS`;
export const FAILED_ITERATIONS = `${typeBase}FAILED_ITERATIONS`;
export const AUTOMATION_FINISHED = `${typeBase}AUTOMATION_FINISHED`;

/* 
  Although the sender parameter is unused in these action creators,
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

export const completedIteration = (sender, iterationData) => {
  return (dispatch) => {
    dispatch({
      type: COMPLETED_ITERATIONS,
      payload: iterationData,
    });
  };
};

export const cancelledIteration = (sender, iterationData) => {
  return (dispatch) => {
    dispatch({
      type: CANCELLED_ITERATIONS,
      payload: iterationData,
    });
  };
};

export const failedIteration = (sender, iterationData) => {
  return (dispatch) => {
    dispatch({
      type: FAILED_ITERATIONS,
      payload: iterationData,
    });
  };
};

export const automationFinished = (sender, iterationData) => {
  return (dispatch) => {
    dispatch({
      type: AUTOMATION_FINISHED,
      payload: null,
    });
  };
};
