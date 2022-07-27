// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const Store = require("electron-store");
const { createWindow } = require("./electron/createWindow");
const { createTray } = require("./electron/createTray");
require("./ipc-listeners/allListeners");

/* 
---------------------------START OF BASE TEMPLATE---------------------------
*/

let tray, window, isScreenPositionCustom;
let store = new Store();

/* 
  This method will be called when Electron has finished
  initialization and is ready to create browser windows.
  Some APIs can only be used after this event occurs. 
*/
app.whenReady().then(() => {
  createTray(window, tray, __dirname, process);
  createWindow(window, tray, __dirname, process, store);

  app.on("activate", function () {
    /* 
      On macOS it's common to re-create a window in the app when the
      dock icon is clicked and there are no other windows open.
    */
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow(window, tray, __dirname, process, store);
  });
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
---------------------------END OF BASE TEMPLATE---------------------------
*/

console.log("Settings path: ", app.getPath("userData"));
