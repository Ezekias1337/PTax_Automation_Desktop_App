// Library Imports
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
// Redux
import { actionCreators } from "../redux/allActions";
// window.require Imports
const Store = window.require("electron-store");

export const usePersistentSettings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const store = new Store();
    const { saveSettings } = bindActionCreators(
      actionCreators.settingsCreators,
      dispatch
    );

    const persistentSettings = store.get("userSettings");
    if (persistentSettings !== undefined) {
      saveSettings(persistentSettings);
    }
  }, [dispatch]);
};
