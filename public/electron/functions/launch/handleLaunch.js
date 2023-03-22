// Library Imports
const { app, BrowserWindow, ipcMain } = require("electron");
const { IpcBusBridge, IpcBusClient } = require("electron-common-ipc");
const log = require("electron-log");
// Functions
const { createIpcBusBridge } = require("../ipc/createIpcBusBridge");
const { createWindow } = require("../window/createWindow");
const { createTray } = require("../tray/createTray");
const { closeWindow } = require("../window/closeWindow");
// Constants
const { UPDATE_INSTALLED_SUCCESS } = require("../../constants/updateActions");

const handleLaunch = async (
  tray,
  updaterWindow,
  mainWindow,
  store,
  directoryName
) => {
  const isDev = !app.isPackaged;
  if (isDev === true) {
    const reactDevToolsId = "fmkadmapgofadopljbjfkapdkoienihi";
    const {
      default: installExtension,
      REDUX_DEVTOOLS,
    } = require("electron-devtools-installer");
    installExtension([REDUX_DEVTOOLS, reactDevToolsId])
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));
  }

  log.info("CREATING IPC Bridge...........");
  await createIpcBusBridge();
  log.info("CREATING UPDATER WINDOW...........");
  updaterWindow = createWindow(directoryName, true, store, isDev);

  IpcBusBridge.
  
  IpcBusBridge.on(UPDATE_INSTALLED_SUCCESS, (event, message) => {
    console.log("UPDATE SUCCESS INSIDE HANDLELAUNCH");
    if (isDev === true) {
      log.info("CREATING MAIN WINDOW...........");
      console.log("UPDATE SUCCESS INSIDE HANDLELAUNCH");

      closeWindow(updaterWindow);
    }
  });

  /* 
      Create the main window after the update window has been closed
  */

  updaterWindow.on("closed", () => {
    mainWindow = createWindow(directoryName, false, store, isDev);
    if (tray !== undefined) {
      tray.destroy();
    }

    tray = createTray(mainWindow, directoryName, process);
  });

  app.on("activate", function () {
    /* 
      On macOS it's common to re-create a window in the app when the
      dock icon is clicked and there are no other windows open.
    */
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow(directoryName, false, store, isDev);
  });
};

module.exports = { handleLaunch };
