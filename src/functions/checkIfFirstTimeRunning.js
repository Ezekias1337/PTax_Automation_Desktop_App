const Store = window.require("electron-store");
const store = new Store();

export const checkIfFirstTimeRunning = () => {
  const isFirstTimeRunning = store.get("userSettings.firstTimeRunning");

  if (isFirstTimeRunning === undefined) {
    return true;
  } else if (isFirstTimeRunning === false) {
    return false;
  }
};
