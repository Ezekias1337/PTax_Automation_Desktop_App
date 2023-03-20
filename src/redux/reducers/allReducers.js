import { combineReducers } from "redux";
import settingsReducer from "./individual/settingsReducer";
import spreadsheetReducer from "./individual/spreadsheetReducer";
import automationReducer from "./individual/automationReducers";
import eventLogReducer from "./individual/eventLogReducers";
import animatedBackgroundReducer from "./individual/animatedBackgroundReducers";
import updateReducer from "./individual/updateReducers";

const reducers = combineReducers({
  settings: settingsReducer,
  spreadsheet: spreadsheetReducer,
  automation: automationReducer,
  eventLog: eventLogReducer,
  animatedBackground: animatedBackgroundReducer,
  update: updateReducer,
});

export default reducers;
