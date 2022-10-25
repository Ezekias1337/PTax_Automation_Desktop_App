// Modules to control application life and create native browser window
const { app, BrowserWindow } = require("electron");
const {
  default: installExtension,
  REDUX_DEVTOOLS,
} = require("electron-devtools-installer");
const Store = require("electron-store");
const { createIpcBusBridge } = require("./electron/createIpcBusBridge");
const { createWindow } = require("./electron/createWindow");
const { createTray } = require("./electron/createTray");
require("./electron/ipc-main-listeners/allListeners");


/* 
---------------------------START OF BASE TEMPLATE---------------------------
*/

let store = new Store();
let tray;

/* 
  This method will be called when Electron has finished
  initialization and is ready to create browser windows.
  Some APIs can only be used after this event occurs. 
*/
const reactDevToolsId = "fmkadmapgofadopljbjfkapdkoienihi";

app.whenReady().then(() => {
  installExtension([REDUX_DEVTOOLS, reactDevToolsId])
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));
  const window = createWindow(__dirname, process, store);
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
---------------------------END OF BASE TEMPLATE---------------------------
*/

console.log("Settings path: ", app.getPath("userData"));
