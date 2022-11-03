// window.require Imports
const { ipcRenderer } = window.require("electron");

export const sendToIpc = (channel, message) => {
  ipcRenderer.send(channel, message);
};
