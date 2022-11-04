const { ipcMain } = require("electron");
const {
  startIpcBusBroker,
} = require("../../../../selenium/ipc-bus/startIpcBusBroker");
const { automation } = require("../../../../selenium/automation");

module.exports = {
  browserListener: ipcMain.on("launchBrowser", async (event, message) => {
    const ipcBusClientNodeMain = await startIpcBusBroker();
    await automation(message, ipcBusClientNodeMain);
  }),
};
