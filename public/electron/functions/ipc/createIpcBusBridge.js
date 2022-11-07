const { IpcBusBridge, IpcBusClient } = require("electron-common-ipc");
const portfinder = require("portfinder");

const createIpcBusBridge = async () => {
  const freePort = await portfinder.getPortPromise();
  
  const ipcBusBridge = IpcBusBridge.Create();
  await ipcBusBridge.connect(freePort);

  const ipcBusClientElectronMain = IpcBusClient.Create();
  await ipcBusClientElectronMain.connect();
  
  console.log("ipcBusBridge instantiated in Electron!", new Date())
};

module.exports = { createIpcBusBridge };
