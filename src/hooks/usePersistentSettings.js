// Library Imports
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
// Redux
import { actionCreators } from "../redux/allActions";
// window.require Imports
const Store = window.require("electron-store");

export const usePersistentSettings = () => {
  const store = new Store();
  const dispatch = useDispatch();
  const { saveSettings } = bindActionCreators(actionCreators, dispatch);

  const persistentSettings = store.get("userSettings");
  if (persistentSettings !== undefined) {
    saveSettings(persistentSettings);
  }
};
