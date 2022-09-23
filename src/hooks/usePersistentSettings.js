import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../redux/allActions";

const Store = window.require("electron-store");
const store = new Store();

export const usePersistentSettings = () => {
  const dispatch = useDispatch();
  const { saveSettings } = bindActionCreators(actionCreators, dispatch);

  const persistentSettings = store.get("userSettings");
  if (persistentSettings !== undefined) {
    saveSettings(persistentSettings);
  }
};
