// Utils
import { buildInitialState } from "../../../utils/redux/buildInitialState";
// Action Types
import {
  RECEIVE_ITERATION,
  RECEIVE_ITERATION_LOADING_TOGGLE,
  RECEIVE_ITERATION_ERROR,
  RECEIVE_ITERATION_RESET,
} from "../../actionCreators/automationCreators";

const INITIAL_STATE = {
  ...buildInitialState([RECEIVE_ITERATION]),
};

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
        newStateObject.contents[RECEIVE_ITERATION] = action.payload;
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
      newStateObject = buildInitialState([RECEIVE_ITERATION]);

      return newStateObject;

    default:
      return state;
  }
};

export default reducer;
