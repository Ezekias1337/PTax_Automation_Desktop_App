// Library Imports
const { app, BrowserWindow, dialog } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");
//Functions
const { createIpcBusBridge } = require("../ipc/createIpcBusBridge");
const { createWindow } = require("../window/createWindow");
const { createTray } = require("../tray/createTray");

const handleLaunch = (tray, window, store, directoryName) => {
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
  log.info("CREATING WINDOW...........");
  window = createWindow(directoryName, process, store, isDev);
  if (tray !== undefined) {
    tray.destroy();
  }

  tray = createTray(window, directoryName, process);
  createIpcBusBridge();

  app.on("activate", function () {
    /* 
      On macOS it's common to re-create a window in the app when the
      dock icon is clicked and there are no other windows open.
    */
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow(window, tray, directoryName, process, store);
  });

  if (isDev === false) {
    autoUpdater.checkForUpdates();
  }

  autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: "info",
      buttons: ["Install Update"],
      title: "Application Update",
      message: process.platform === "win32" ? releaseNotes : releaseName,
      detail: "A new version is being downloaded.",
    };
    dialog.showMessageBox(dialogOpts, (response) => {});
  });

  autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: "info",
      buttons: ["Restart", "Later"],
      title: "Application Update",
      message: process.platform === "win32" ? releaseNotes : releaseName,
      detail:
        "A new version has been downloaded. Restart the application to apply the updates.",
    };
    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        autoUpdater.quitAndInstall();
        app.exit();
      }
    });
  });
};

module.exports = { handleLaunch };
