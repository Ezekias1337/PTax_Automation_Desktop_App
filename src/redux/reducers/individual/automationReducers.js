// Utils
import { buildInitialState } from "../../../utils/redux/buildInitialState";
// Action Types
import {
  RECEIVE_ITERATION,
  RECEIVE_ITERATION_LOADING_TOGGLE,
  RECEIVE_ITERATION_ERROR,
  RECEIVE_ITERATION_RESET,
  COMPLETED_ITERATIONS,
  CANCELLED_ITERATIONS,
  FAILED_ITERATIONS,
  AUTOMATION_FINISHED,
} from "../../actionCreators/automationCreators";

const INITIAL_STATE = {
  ...buildInitialState([
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

const reducer = (state = INITIAL_STATE, action) => {
  let newStateObject;

  switch (action.type) {
    case RECEIVE_ITERATION:
      newStateObject = {
        ...state,
      };

      if (action.payload === null) {
        newStateObject.errors[RECEIVE_ITERATION].push(
          "The iteration data received is undefined."
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
      newStateObject = {
        ...buildInitialState([
          RECEIVE_ITERATION,
          COMPLETED_ITERATIONS,
          CANCELLED_ITERATIONS,
          FAILED_ITERATIONS,
        ]),
      };
      delete newStateObject.contents[RECEIVE_ITERATION];
      newStateObject.currentIteration = {};
      newStateObject.currentIteration[RECEIVE_ITERATION] = null;
      newStateObject.automationFinished = {};
      newStateObject.automationFinished[AUTOMATION_FINISHED] = false;

      return newStateObject;

    case COMPLETED_ITERATIONS:
      newStateObject = {
        ...state,
      };
      if (action.payload === null) {
        newStateObject.errors[COMPLETED_ITERATIONS].push(
          "The iteration data received is undefined."
        );
      } else {
        newStateObject.contents[COMPLETED_ITERATIONS].push(action.payload);
      }
      return newStateObject;

    case CANCELLED_ITERATIONS:
      newStateObject = {
        ...state,
      };
      if (action.payload === null) {
        newStateObject.errors[CANCELLED_ITERATIONS].push(
          "The iteration data received is undefined."
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
          "The iteration data received is undefined."
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
