// window.require Imports
const { ipcRenderer } = window.require("electron");

export const sendToIpc = (channel, message) => {
  console.log("channel: ", channel);
  console.log("message: ", message);
  ipcRenderer.send(channel, message);
};
