// Functions, Helpers, Utils
const { testConnectivity } = require("../listeners/testConnectivity");
// window.require Imports
const { IpcBusClient } = window.require("electron-common-ipc");

export const createIpcBusClientRenderer = async (
  peerName,
  timeoutDelay = 2000
) => {
  const ipcBusClientRenderer = IpcBusClient.Create();
  await ipcBusClientRenderer.connect({
    peerName: peerName,
    timeoutDelay: timeoutDelay,
  });

  console.log("Connection to IpcBus instantiated in React!", new Date());

  testConnectivity(ipcBusClientRenderer);
  return ipcBusClientRenderer;
};
