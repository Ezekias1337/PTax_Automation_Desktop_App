// Constants
const typeBase = "automation/";
// Action Types
export const RECEIVE_AUTOMATION_CONFIG = `${typeBase}RECEIVE_AUTOMATION_CONFIG`;
export const RECEIVE_AUTOMATION_CONFIG_RESET = `${typeBase}RECEIVE_AUTOMATION_CONFIG_RESET`;

export const RECEIVE_ITERATION = `${typeBase}RECEIVE_ITERATION`;
export const RECEIVE_ITERATION_LOADING_TOGGLE = `${typeBase}RECEIVE_ITERATION_LOADING_TOGGLE`;
export const RECEIVE_ITERATION_ERROR = `${typeBase}RECEIVE_ITERATION_ERROR`;
export const RECEIVE_ITERATION_RESET = `${typeBase}RECEIVE_ITERATION_RESET`;

export const COMPLETED_ITERATIONS = `${typeBase}COMPLETED_ITERATIONS`;
export const CANCELLED_ITERATIONS = `${typeBase}CANCELLED_ITERATIONS`;
export const FAILED_ITERATIONS = `${typeBase}FAILED_ITERATIONS`;
export const AUTOMATION_FINISHED = `${typeBase}AUTOMATION_FINISHED`;

export const CHROME_DRIVER_NEEDS_UPDATE = `${typeBase}CHROME_DRIVER_NEEDS_UPDATE`;
export const CHROME_DRIVER_NEEDS_UPDATE_RESET = `${typeBase}CHROME_DRIVER_NEEDS_UPDATE_RESET`;
export const CHROME_NOT_INSTALLED = `${typeBase}CHROME_NOT_INSTALLED`;
export const CHROME_NOT_INSTALLED_RESET = `${typeBase}CHROME_NOT_INSTALLED_RESET`;

export const UNKNOWN_ERROR = `${typeBase}UNKNOWN_ERROR`;
export const UNKNOWN_ERROR_RESET = `${typeBase}UNKNOWN_ERROR_RESET`;

/* 
  Although the sender parameter is unused in these action creators,
  I cannot remove the parameter, because Electron will send the event object
  instead of the contents of the message from the backend
*/

export const recieveAutomationConfig = (sender, automationData) => {
  return (dispatch) => {
    dispatch({
      type: RECEIVE_AUTOMATION_CONFIG,
      payload: automationData,
    });
  };
};

export const recieveAutomationConfigReset = () => {
  return (dispatch) => {
    dispatch({
      type: RECEIVE_AUTOMATION_CONFIG_RESET,
      payload: null,
    });
  };
};

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

export const chromeDriverNeedsUpdate = (sender, iterationData) => {
  return (dispatch) => {
    dispatch({
      type: CHROME_DRIVER_NEEDS_UPDATE,
      payload: null,
    });
  };
};

export const chromeDriverNeedsUpdateReset = () => {
  return (dispatch) => {
    dispatch({
      type: CHROME_DRIVER_NEEDS_UPDATE_RESET,
      payload: null,
    });
  };
};

export const chromeNotInstalled = (sender, iterationData) => {
  return (dispatch) => {
    dispatch({
      type: CHROME_NOT_INSTALLED,
      payload: null,
    });
  };
};

export const chromeNotInstalledReset = () => {
  return (dispatch) => {
    dispatch({
      type: CHROME_NOT_INSTALLED_RESET,
      payload: null,
    });
  };
};

export const unknownError = (sender, errorMsg) => {
  return (dispatch) => {
    dispatch({
      type: UNKNOWN_ERROR,
      payload: errorMsg,
    });
  };
};

export const unknownErrorReset = () => {
  return (dispatch) => {
    dispatch({
      type: UNKNOWN_ERROR_RESET,
      payload: null,
    });
  };
};
