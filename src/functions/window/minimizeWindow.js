// window.require Imports
const { ipcRenderer } = window.require("electron");

const minimizeWindow = () => {
  ipcRenderer.send("windowMinimize");
};

module.exports = { minimizeWindow };
