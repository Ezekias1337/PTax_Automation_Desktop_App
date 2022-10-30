const Store = window.require("electron-store");
const store = new Store();

export const useIsFirstTimeRunning = () => {
  const isFirstTimeRunning = store.get("userSettings.firstTimeRunning");

  if (isFirstTimeRunning === undefined) {
    return true;
  } else if (isFirstTimeRunning === false) {
    return false;
  }
};
