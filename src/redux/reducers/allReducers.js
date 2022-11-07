import { combineReducers } from "redux";
import settingsReducer from "./individual/settingsReducer";
import spreadsheetReducer from "./individual/spreadsheetReducer";
import automationReducer from "./individual/automationReducers";

const reducers = combineReducers({
  settings: settingsReducer,
  spreadsheet: spreadsheetReducer,
  automation: automationReducer,
});

export default reducers;
