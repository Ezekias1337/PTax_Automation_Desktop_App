// Utils
import { buildInitialState } from "../../../utils/redux/buildInitialState";
// Action Types
import {
  READ_SPREADSHEET,
  READ_SPREADSHEET_LOADING_TOGGLE,
  READ_SPREADSHEET_ERROR,
  READ_SPREADSHEET_RESET,
  SAVE_SPREADSHEET,
  SAVE_SPREADSHEET_LOADING_TOGGLE,
  SAVE_SPREADSHEET_ERROR,
  SAVE_SPREADSHEET_RESET,
} from "../../actionCreators/spreadsheetCreators";

const INITIAL_STATE = {
  ...buildInitialState([READ_SPREADSHEET, SAVE_SPREADSHEET]),
};

const reducer = (state = INITIAL_STATE, action) => {
  let newStateObject;

  switch (action.type) {
    case READ_SPREADSHEET:
      newStateObject = {
        ...state,
      };

      if (action.payload === null) {
        newStateObject.errors[READ_SPREADSHEET].push(
          "The path provided to the file does not exist, please double check and try again."
        );
      } else {
        newStateObject.contents[READ_SPREADSHEET] = action.payload;
      }
      return newStateObject;

    case READ_SPREADSHEET_LOADING_TOGGLE:
      newStateObject = {
        ...state,
      };

      newStateObject.loading[READ_SPREADSHEET] = action.payload;
      return newStateObject;

    case READ_SPREADSHEET_ERROR:
      newStateObject = {
        ...state,
      };

      newStateObject.errors[READ_SPREADSHEET].push(action.payload);
      return newStateObject;

    case READ_SPREADSHEET_RESET:
      newStateObject = buildInitialState([READ_SPREADSHEET]);

      return newStateObject;

    case SAVE_SPREADSHEET:
      newStateObject = {
        ...state,
      };
      
      /* 
        ! NEED TO FIGURE OUT DATA STRUCTURE I WANT TO USE HERE BECAUSE OF NULL
        ! THIS WILL ONLY BE USED TO DISPLAY TOAST WHEN FILE IS SAVED SUCCESSFULLY
        ! OR THERE IS AN ERROR
      */

      return newStateObject;
    default:
      return state;
  }
};

export default reducer;
