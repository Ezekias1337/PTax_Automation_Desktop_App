const log = require("electron-log");

try {
  log.info("IMPORTING MODULES");
  // Modules to control application life and create native browser window
  const { app, BrowserWindow, dialog } = require("electron");
  // Library Imports
  const Store = require("electron-store");
  const { autoUpdater } = require("electron-updater");
  //Functions
  const {
    createIpcBusBridge,
  } = require("./electron/functions/ipc/createIpcBusBridge");
  const { createWindow } = require("./electron/functions/window/createWindow");
  const { createTray } = require("./electron/functions/tray/createTray");
  // Listeners
  require("./electron/ipc-main-listeners/allListeners");

  /* 
---------------------------START OF BASE TEMPLATE---------------------------
*/
  log.info("CREATING STORE");
  let store = new Store();
  let tray, window;

  /* 
  The whenReady method will be called when Electron has finished
  initialization and is ready to create browser windows.
  Some APIs can only be used after this event occurs. 
*/

  app.whenReady().then(() => {
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
    window = createWindow(__dirname, process, store, isDev);
    if (tray !== undefined) {
      tray.destroy();
    }

    tray = createTray(window, __dirname, process);
    createIpcBusBridge();

    app.on("activate", function () {
      /* 
      On macOS it's common to re-create a window in the app when the
      dock icon is clicked and there are no other windows open.
    */
      if (BrowserWindow.getAllWindows().length === 0)
        createWindow(window, tray, __dirname, process, store);
    });

    if (isDev === false) {
      autoUpdater.on(
        "update-available",
        (_event, releaseNotes, releaseName) => {
          const dialogOpts = {
            type: "info",
            buttons: ["Ok"],
            title: "Application Update",
            message: process.platform === "win32" ? releaseNotes : releaseName,
            detail: "A new version is being downloaded.",
          };
          dialog.showMessageBox(dialogOpts, (response) => {});
        }
      );

      autoUpdater.on(
        "update-downloaded",
        (_event, releaseNotes, releaseName) => {
          const dialogOpts = {
            type: "info",
            buttons: ["Restart", "Later"],
            title: "Application Update",
            message: process.platform === "win32" ? releaseNotes : releaseName,
            detail:
              "A new version has been downloaded. Restart the application to apply the updates.",
          };
          dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall();
          });
        }
      );
    }
  });

  /* 
  Prevent Tray Icon Duplication
*/

  app.on("before-quit", function () {
    tray.destroy();
  });

  /* 
  Quit when all windows are closed, except on macOS. There, it's common
  for applications and their menu bar to stay active until the user quits
  explicitly with Cmd + Q. 
*/
  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
  });

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.

  /* 
    There is a bug that is causing the app screen to turn white while the script keeps running,
    here a logger is added to catch what's causing the issue
  */

  //handle crashes and kill events
  process.on("uncaughtException", function (err) {
    //log the message and stack trace
    log.warn(err);
    //relaunch the app
    app.relaunch({ args: [] });
    app.exit(0);
  });

  process.on("SIGTERM", function (err) {
    //log the message and stack trace
    log.warn(err, "SIGTERM ISSUE");
    //relaunch the app
    app.relaunch({ args: [] });
    app.exit(0);
  });

  /* 
---------------------------END OF BASE TEMPLATE---------------------------
*/

  console.log("Settings path: ", app.getPath("userData"));
  log.info("BUILD SUCCESSFUL");
} catch (error) {
  log.warn(error);
}
