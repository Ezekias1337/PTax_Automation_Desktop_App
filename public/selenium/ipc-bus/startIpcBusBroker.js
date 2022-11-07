const { IpcBusBroker, IpcBusClient } = require("electron-common-ipc");
require("dotenv").config();

const startIpcBusBroker = async () => {
  const freePort = process.env.FREE_PORT;

  const ipcBusBroker = IpcBusBroker.Create();
  await ipcBusBroker.connect(freePort);

  const ipcBusClientNodeMain = IpcBusClient.Create();
  await ipcBusClientNodeMain.connect(freePort);

  console.log("ipcBusBroker instantiated in Node.js", new Date());
  return ipcBusClientNodeMain;
};

module.exports = { startIpcBusBroker };
