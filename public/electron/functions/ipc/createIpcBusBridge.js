const { IpcBusBridge, IpcBusClient } = require("electron-common-ipc");
const portfinder = require("portfinder");

/* 
  This function was made recursive because it sometimes fails
  and the app won't launch as a result. It'll keep calling itself
  until the connection is successful.
*/

const createIpcBusBridge = async () => {
  let connectionSuccessful = false;

  if (connectionSuccessful === false) {
    try {
      const freePort = await portfinder.getPortPromise();

      const ipcBusBridge = IpcBusBridge.Create();
      await ipcBusBridge.connect(freePort);

      const ipcBusClientElectronMain = IpcBusClient.Create();
      await ipcBusClientElectronMain.connect();

      console.log("ipcBusBridge instantiated in Electron!", new Date());
      connectionSuccessful = true;
    } catch (error) {
      await createIpcBusBridge();
    }
  }
};

module.exports = { createIpcBusBridge };
