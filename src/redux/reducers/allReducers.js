import { combineReducers } from "redux";
import settingsReducer from "./individual/settingsReducer";
import spreadsheetReducer from "./individual/spreadsheetReducer";
import automationReducer from "./individual/automationReducers";
import eventLogReducer from "./individual/eventLogReducers";

const reducers = combineReducers({
  settings: settingsReducer,
  spreadsheet: spreadsheetReducer,
  automation: automationReducer,
  eventLog: eventLogReducer,
});

export default reducers;
