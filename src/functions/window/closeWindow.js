const { ipcRenderer } = window.require("electron");

const closeWindow = () => {
  ipcRenderer.send("windowClose");
};

module.exports = { closeWindow };
