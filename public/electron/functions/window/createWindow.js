// Library Imports
const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const log = require("electron-log");
// Functions
const { handleResolutionPref } = require("./handleResolutionPref");
const { handlePositionPref } = require("./handlePositionPref");
const { maximizeWindow } = require("./maximizeWindow");
const { minimizeWindow } = require("./minimizeWindow");
const { closeWindow } = require("./closeWindow");

const createWindow = (directoryName, process, store, isDev) => {
  try {
    const [screenWidth, screenHeight] = handleResolutionPref(store);
    const [screenXCoordinate, screenYCoordinate, isScreenPositionCustom] =
      handlePositionPref(store);

    let window = null;
    const browserWindowOptions = {
      width: screenWidth,
      height: screenHeight,
      frame: false,
      fullscreenable: true,
      resizable: true,
      transparent: false,
      webPreferences: {
        preload: path.join(directoryName, "preload.bundle.js"),
        contextIsolation: false,
        nodeIntegration: true,
        sandbox: false,
        webSecurity: false,
      },
      icon: path.join(directoryName, "icon.ico"),
    };

    // Create the browser window.
    if (isScreenPositionCustom === true) {
      browserWindowOptions.x = screenXCoordinate;
      browserWindowOptions.y = screenYCoordinate;

      window = new BrowserWindow(browserWindowOptions);
    } else {
      window = new BrowserWindow(browserWindowOptions);
    }

    window.on("closed", () => (window = null));

    if (isDev === true) {
      window.loadURL("http://localhost:3000");
    } else {
      window.loadURL(
        url.format({
          pathname: path.join(directoryName, "index.html"),
          protocol: "file:",
          slashes: true,
        })
      );
    }

    // Handle window toggling for custom titlebar
    ipcMain.on("windowMinimize", () => minimizeWindow(window));
    ipcMain.on("windowMaximize", () => maximizeWindow(window));
    ipcMain.on("windowClose", () => closeWindow(window));

    // Open the DevTools.
    // window.webContents.openDevTools()

    return window;
  } catch (error) {
    log.info("CREATE WINDOW ERROR INSIDE FUNCTION: ", error);
  }
};

module.exports = { createWindow };
