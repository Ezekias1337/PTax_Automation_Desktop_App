// Functions, Helpers, Utils
import { getWindowPosition } from "../../utils/window/getWindowPosition";
// window.require Imports
const Store = window.require("electron-store");

export const saveUserSettings = (userSettings) => {
  const store = new Store();
  const settingsObject = { ...userSettings };
  const currentScreenPosition = getWindowPosition();

  settingsObject.launchWindowinCurrentPositionvalue = currentScreenPosition;
  store.set("userSettings", settingsObject);

  const settingsToReturn = store.get("userSettings");
  return settingsToReturn;
};
