const { IpcBusBridge, IpcBusClient } = require("electron-common-ipc");
require("dotenv").config();

const createIpcBusBridge = async () => {
  const freePort = process.env.FREE_PORT;
  
  const ipcBusBridge = IpcBusBridge.Create();
  await ipcBusBridge.connect(freePort);

  const ipcBusClientElectronMain = IpcBusClient.Create();
  await ipcBusClientElectronMain.connect();
  
  console.log("ipcBusBridge instantiated in Electron!", new Date())
};

module.exports = { createIpcBusBridge };
