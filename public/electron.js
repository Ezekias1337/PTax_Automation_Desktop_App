// Modules to control application life and create native browser window
const { app, crashReporter } = require("electron");
// Library Imports
const Store = require("electron-store");
const log = require("electron-log");
// Functions
const { handleLaunch } = require("./electron/functions/launch/handleLaunch");
// Constants
const {
  UPDATE_INSTALLED_SUCCESS,
} = require("./electron/constants/updateActions");
// Listeners
require("./electron/ipc-main-listeners/allListeners");

/* 
---------------------------START OF BASE TEMPLATE---------------------------
*/
log.info("CREATING STORE");
let store = new Store();
let tray, updaterWindow, mainWindow;

/* 
    The whenReady method will be called when Electron has finished
    initialization and is ready to create browser windows.
    Some APIs can only be used after this event occurs. 
*/

app.whenReady().then(() => {
  handleLaunch(tray, updaterWindow, mainWindow, store, __dirname);
});

/* 
    Prevent Tray Icon Duplication
*/

app.on("before-quit", function () {
  tray.destroy();
  window.webContents.send(UPDATE_INSTALLED_SUCCESS, true);
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

crashReporter.start({
  productName: "ptax-automation-desktop-app",
  companyName: "Property Tax Resources",
  submitUrl: "",
  uploadToServer: false,
});

app.on("child-process-gone", function (err) {
  log.warn("Child Process Gone: ", err);
});

app.on("render-process-gone", function (err) {
  log.warn("Render Process Gone: ", err);
});

//handle crashes and kill events
process.on("uncaughtException", function (err) {
  //log the message and stack trace
  log.warn("uncaught Exception: ", err);
  //relaunch the app
  app.relaunch();
  app.exit();
  log.info("Relaunching application...");
  handleLaunch(tray, window, store, __dirname);
});

process.on("SIGTERM", function (err) {
  //log the message and stack trace
  log.warn(err, "SIGTERM ISSUE");
  //relaunch the app
  app.relaunch();
  app.exit();
  log.info("Relaunching application...");
  handleLaunch(tray, window, store, __dirname);
});

/* 
---------------------------END OF BASE TEMPLATE---------------------------
*/

/*  console.log("Settings path: ", app.getPath("userData"));
  console.log("Crash log path: ", app.getPath("crashDumps"));
  console.log("Temp path: ", app.getPath("temp")); */
log.info("BUILD SUCCESSFUL");
