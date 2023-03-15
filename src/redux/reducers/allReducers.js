import { combineReducers } from "redux";
import settingsReducer from "./individual/settingsReducer";
import spreadsheetReducer from "./individual/spreadsheetReducer";
import automationReducer from "./individual/automationReducers";
import eventLogReducer from "./individual/eventLogReducers";
import animatedBackgroundReducer from "./individual/animatedBackgroundReducers";

const reducers = combineReducers({
  settings: settingsReducer,
  spreadsheet: spreadsheetReducer,
  automation: automationReducer,
  eventLog: eventLogReducer,
  animatedBackground: animatedBackgroundReducer,
});

export default reducers;
