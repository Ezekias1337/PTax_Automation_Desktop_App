// window.require Imports
const { ipcRenderer } = window.require("electron");

const maximizeWindow = () => {
  ipcRenderer.send("windowMaximize");
};

module.exports = { maximizeWindow };
