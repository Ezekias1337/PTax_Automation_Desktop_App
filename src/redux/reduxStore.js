// Library Imports
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
// Redux
import reducers from "./reducers/allReducers";
// This is needed for the app to download react/redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const reduxStore = createStore(
  reducers,
  {},
  composeEnhancers(applyMiddleware(thunk))
);
