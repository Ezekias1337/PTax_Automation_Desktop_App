const ipcBusModule = require("electron-common-ipc");
const ipcBus = ipcBusModule.IpcBusClient.Create();

const placeholderFunc = (ipcBusEvent, content) => {
  console.log("oy")
}

const createIpcBusClient = async () => {
  await ipcBus.connect();
  
  ipcBus.on("testing", placeholderFunc)
};

module.exports = { createIpcBusClient };
