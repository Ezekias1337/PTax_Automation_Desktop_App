const { IpcBusBroker, IpcBusClient } = require("electron-common-ipc");
const portfinder = require("portfinder");

/* 
  This function was made recursive because it sometimes fails
  and the app won't launch as a result. It'll keep calling itself
  until the connection is successful.
*/

const startIpcBusBroker = async () => {
  let connectionSuccessful = false;

  if (connectionSuccessful === false) {
    try {
      const freePort = await portfinder.getPortPromise();

      const ipcBusBroker = IpcBusBroker.Create();
      await ipcBusBroker.connect(freePort);

      const ipcBusClientNodeMain = IpcBusClient.Create();
      await ipcBusClientNodeMain.connect(freePort);

      console.log("ipcBusBroker instantiated in Node.js", new Date());
      connectionSuccessful = true;

      return ipcBusClientNodeMain;
    } catch (error) {
      await startIpcBusBroker();
    }
  }
};

module.exports = { startIpcBusBroker };
