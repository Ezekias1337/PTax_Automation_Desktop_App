import { getWindowPosition } from "../../utils/window/getWindowPosition";
const Store = window.require("electron-store");
const store = new Store();

export const saveUserSettings = (userSettings) => {
  store.set("userSettings", userSettings);
  const currentScreenPosition = getWindowPosition();
  store.set(
    "userSettings.launchWindowinCurrentPositionvalue",
    currentScreenPosition
  );

  const settingsToReturn = store.get("userSettings");
  return settingsToReturn;
};
