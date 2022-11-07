const { IpcBusBroker, IpcBusClient } = require("electron-common-ipc");
const portfinder = require("portfinder");

const startIpcBusBroker = async () => {
  const freePort = await portfinder.getPortPromise();

  const ipcBusBroker = IpcBusBroker.Create();
  await ipcBusBroker.connect(freePort);

  const ipcBusClientNodeMain = IpcBusClient.Create();
  await ipcBusClientNodeMain.connect(freePort);

  console.log("ipcBusBroker instantiated in Node.js", new Date());
  return ipcBusClientNodeMain;
};

module.exports = { startIpcBusBroker };
