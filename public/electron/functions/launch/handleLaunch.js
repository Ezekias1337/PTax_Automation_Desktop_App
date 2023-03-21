// Library Imports
const { app, BrowserWindow } = require("electron");
const log = require("electron-log");
//Functions
const { createIpcBusBridge } = require("../ipc/createIpcBusBridge");
const { createWindow } = require("../window/createWindow");
const { createTray } = require("../tray/createTray");

const handleLaunch = async (tray, window, store, directoryName) => {
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
  await createIpcBusBridge();

  app.on("activate", function () {
    /* 
      On macOS it's common to re-create a window in the app when the
      dock icon is clicked and there are no other windows open.
    */
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow(window, tray, directoryName, process, store);
  });
};

module.exports = { handleLaunch };
