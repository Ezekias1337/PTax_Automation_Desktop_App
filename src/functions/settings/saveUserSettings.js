import { getWindowPosition } from "../../utils/window/getWindowPosition";
const Store = window.require("electron-store");
const store = new Store();

export const saveUserSettings = (userSettings) => {
  const settingsObject = { ...userSettings };
  const currentScreenPosition = getWindowPosition();

  settingsObject.launchWindowinCurrentPositionvalue = currentScreenPosition;
  store.set("userSettings", settingsObject);

  const settingsToReturn = store.get("userSettings");
  return settingsToReturn;
};
