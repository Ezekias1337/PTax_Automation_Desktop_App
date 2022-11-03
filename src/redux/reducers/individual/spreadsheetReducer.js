// Utils
import { buildInitialState } from "../../../utils/redux/buildInitialState";
// Action Types
import {
  READ_SPREADSHEET,
  READ_SPREADSHEET_LOADING_TOGGLE,
  READ_SPREADSHEET_ERROR,
} from "../../actionCreators/spreadsheetCreators";

const INITIAL_STATE = {
  ...buildInitialState([READ_SPREADSHEET]),
};

const reducer = (state = INITIAL_STATE, action) => {
  let newStateObject;

  switch (action.type) {
    case READ_SPREADSHEET:
      newStateObject = {
        ...state,
      };

      if (action.payload === null) {
        newStateObject.errors.push(
          "The path provided to the file does not exist, please double check and try again."
        );
      } else {
        newStateObject.contents = action.payload;
      }

      return newStateObject;

    case READ_SPREADSHEET_LOADING_TOGGLE:
      newStateObject = {
        ...state,
      };

      newStateObject.loading = action.payload;

      return newStateObject;

    case READ_SPREADSHEET_ERROR:
      newStateObject = {
        ...state,
      };

      newStateObject.errors[READ_SPREADSHEET].push(action.payload);

      return newStateObject;
    default:
      return state;
  }
};

export default reducer;
