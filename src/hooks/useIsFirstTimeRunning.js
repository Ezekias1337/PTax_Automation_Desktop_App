// window.require Imports
const Store = window.require("electron-store");

export const useIsFirstTimeRunning = () => {
  const store = new Store();
  const isFirstTimeRunning = store.get("userSettings.firstTimeRunning");

  if (isFirstTimeRunning === undefined) {
    return true;
  } else if (isFirstTimeRunning === false) {
    return false;
  }
};
