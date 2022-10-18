import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducers/allReducers";
import thunk from "redux-thunk";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const reduxStore = createStore(
  reducers,
  {},
  composeEnhancers(applyMiddleware(thunk))
);
