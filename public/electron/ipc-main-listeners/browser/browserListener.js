// Library Imports
const { ipcMain } = require("electron");
// Functions, Helpers, Utils
const {
  startIpcBusBroker,
} = require("../../../selenium/ipc-bus/startIpcBusBroker");
const { automation } = require("../../../selenium/automation");

module.exports = {
  browserListener: ipcMain.on("launchBrowser", async (event, message) => {
    const ipcBusClientNodeMain = await startIpcBusBroker();
    await automation(message, ipcBusClientNodeMain);
  }),
};
