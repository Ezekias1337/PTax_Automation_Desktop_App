// Utils
import { buildInitialState } from "../../../utils/redux/buildInitialState";
// Action Types
import {
  RECEIVE_EVENT_LOG_DATA,
  RECEIVE_EVENT_LOG_DATA_LOADING_TOGGLE,
  RECEIVE_EVENT_LOG_DATA_ERROR,
  RECEIVE_EVENT_LOG_DATA_RESET,
} from "../../actionCreators/eventLogCreators";

const INITIAL_STATE = {
  ...buildInitialState([RECEIVE_EVENT_LOG_DATA]),
};

const reducer = (state = INITIAL_STATE, action) => {
  let newStateObject;

  switch (action.type) {
    case RECEIVE_EVENT_LOG_DATA:
      newStateObject = {
        ...state,
      };

      if (action.payload === null) {
        newStateObject.errors[RECEIVE_EVENT_LOG_DATA].push(
          "The event log data received is undefined."
        );
      } else {
        newStateObject.contents[RECEIVE_EVENT_LOG_DATA].push(action.payload);
      }
      return newStateObject;

    case RECEIVE_EVENT_LOG_DATA_LOADING_TOGGLE:
      newStateObject = {
        ...state,
      };

      newStateObject.loading[RECEIVE_EVENT_LOG_DATA] = action.payload;
      return newStateObject;

    case RECEIVE_EVENT_LOG_DATA_ERROR:
      newStateObject = {
        ...state,
      };

      newStateObject.errors[RECEIVE_EVENT_LOG_DATA].push(action.payload);
      return newStateObject;

    case RECEIVE_EVENT_LOG_DATA_RESET:
      newStateObject = buildInitialState([RECEIVE_EVENT_LOG_DATA]);

      return newStateObject;

    default:
      return state;
  }
};

export default reducer;
