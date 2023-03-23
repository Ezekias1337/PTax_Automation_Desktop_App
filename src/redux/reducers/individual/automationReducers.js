// Utils
import { buildInitialState } from "../../../utils/redux/buildInitialState";
// Action Types
import {
  RECEIVE_AUTOMATION_CONFIG,
  RECEIVE_AUTOMATION_CONFIG_RESET,
  RECEIVE_ITERATION,
  RECEIVE_ITERATION_LOADING_TOGGLE,
  RECEIVE_ITERATION_ERROR,
  RECEIVE_ITERATION_RESET,
  COMPLETED_ITERATIONS,
  CANCELLED_ITERATIONS,
  FAILED_ITERATIONS,
  AUTOMATION_FINISHED,
} from "../../actionCreators/automationCreators";

const buildAutomationState = () => {
  const INITIAL_STATE = {
    ...buildInitialState([
      RECEIVE_AUTOMATION_CONFIG,
      RECEIVE_ITERATION,
      COMPLETED_ITERATIONS,
      CANCELLED_ITERATIONS,
      FAILED_ITERATIONS,
    ]),
  };
  delete INITIAL_STATE.contents[RECEIVE_ITERATION];
  INITIAL_STATE.currentIteration = {};
  INITIAL_STATE.currentIteration[RECEIVE_ITERATION] = null;
  INITIAL_STATE.automationFinished = {};
  INITIAL_STATE.automationFinished[AUTOMATION_FINISHED] = false;
  INITIAL_STATE.contents[RECEIVE_AUTOMATION_CONFIG] = {};

  return INITIAL_STATE;
};

const INITIAL_STATE = buildAutomationState();

const reducer = (state = INITIAL_STATE, action) => {
  let newStateObject;

  switch (action.type) {
    case RECEIVE_AUTOMATION_CONFIG:
      newStateObject = {
        ...state,
      };

      if (action.payload === null) {
        newStateObject.errors[RECEIVE_AUTOMATION_CONFIG].push(
          "The automation config received is null."
        );
      } else {
        newStateObject.contents[RECEIVE_AUTOMATION_CONFIG] = action.payload;
      }
      return newStateObject;

    case RECEIVE_AUTOMATION_CONFIG_RESET:
      newStateObject = buildAutomationState();

      return newStateObject;

    case RECEIVE_ITERATION:
      newStateObject = {
        ...state,
      };

      if (action.payload === null) {
        newStateObject.errors[RECEIVE_ITERATION].push(
          "The iteration data received is null."
        );
      } else {
        newStateObject.currentIteration[RECEIVE_ITERATION] = action.payload;
      }
      return newStateObject;

    case RECEIVE_ITERATION_LOADING_TOGGLE:
      newStateObject = {
        ...state,
      };

      newStateObject.loading[RECEIVE_ITERATION] = action.payload;
      return newStateObject;

    case RECEIVE_ITERATION_ERROR:
      newStateObject = {
        ...state,
      };

      newStateObject.errors[RECEIVE_ITERATION].push(action.payload);
      return newStateObject;

    case RECEIVE_ITERATION_RESET:
      newStateObject = buildAutomationState();

      return newStateObject;

    case COMPLETED_ITERATIONS:
      newStateObject = {
        ...state,
      };
      if (action.payload === null) {
        newStateObject.errors[COMPLETED_ITERATIONS].push(
          "The iteration data received is null."
        );
      } else {
        newStateObject.contents[COMPLETED_ITERATIONS].push(action.payload);
      }
      return newStateObject;

    case CANCELLED_ITERATIONS:
      newStateObject = {
        ...state,
      };
      if (
        action.payload === null ||
        (action.payload &&
          Object.keys(action.payload).length === 0 &&
          Object.getPrototypeOf(action.payload) === Object.prototype)
      ) {
        newStateObject.errors[CANCELLED_ITERATIONS].push(
          "The iteration data received is null."
        );
      } else {
        newStateObject.contents[CANCELLED_ITERATIONS] = action.payload;
      }
      return newStateObject;

    case FAILED_ITERATIONS:
      newStateObject = {
        ...state,
      };
      if (action.payload === null) {
        newStateObject.errors[FAILED_ITERATIONS].push(
          "The iteration data received is null."
        );
      } else {
        newStateObject.contents[FAILED_ITERATIONS].push(action.payload);
      }
      return newStateObject;

    case AUTOMATION_FINISHED:
      newStateObject = {
        ...state,
      };

      newStateObject.automationFinished[AUTOMATION_FINISHED] = true;

      return newStateObject;

    default:
      return state;
  }
};

export default reducer;
