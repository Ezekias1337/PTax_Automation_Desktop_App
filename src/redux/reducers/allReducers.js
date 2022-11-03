import { combineReducers } from "redux";
import settingsReducer from "./individual/settingsReducer";
import spreadsheetReducer from "./individual/spreadsheetReducer";

const reducers = combineReducers({
  settings: settingsReducer,
  spreadsheet: spreadsheetReducer,
});

export default reducers;
