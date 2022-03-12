const Store = window.require("electron-store");

const store = new Store();

export const getUserSettings = () => {
  const settings = store.get("userSettings");
  return settings
};
