// Library Imports
const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");
// Functions
const { handleResolutionPref } = require("./handleResolutionPref");
const { handlePositionPref } = require("./handlePositionPref");
const { maximizeWindow } = require("./maximizeWindow");
const { minimizeWindow } = require("./minimizeWindow");
const { closeWindow } = require("./closeWindow");
// Listeners
require("../updater/listeners/updateAvailable");
require("../updater/listeners/updateDownloaded");

const createWindow = (directoryName, process, store) => {
  const [screenWidth, screenHeight] = handleResolutionPref(store);
  const [screenXCoordinate, screenYCoordinate, isScreenPositionCustom] =
    handlePositionPref(store);

  let window = null;

  // Create the browser window.
  if (isScreenPositionCustom === true) {
    window = new BrowserWindow({
      width: screenWidth,
      height: screenHeight,
      frame: false,
      fullscreenable: true,
      resizable: true,
      transparent: false,
      x: screenXCoordinate,
      y: screenYCoordinate,
      webPreferences: {
        preload: path.join(directoryName, "preload.bundle.js"),
        contextIsolation: false,
        nodeIntegration: true,
        sandbox: false,
        webSecurity: false,
      },
      icon: path.join(directoryName, "public/images/icon.ico"),
    });
  } else {
    window = new BrowserWindow({
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
      icon: path.join(directoryName, "public/images/icon.ico"),
    });
  }

  window.on("closed", () => (window = null));

  console.log(`file://${__dirname}/../build/index.html`);

  window.loadURL(
    isDev
      ? "http://localhost:3000"
      : url.format({
          pathname: path.join(__dirname, "../index.html"),
          protocol: "file:",
          slashes: true,
        })
  );

  // Handle window toggling for custom titlebar
  ipcMain.on("windowMinimize", () => minimizeWindow(window));
  ipcMain.on("windowMaximize", () => maximizeWindow(window));
  ipcMain.on("windowClose", () => closeWindow(window));

  // Open the DevTools.
  // window.webContents.openDevTools()

  if (isDev === false) {
    autoUpdater.checkForUpdates();
  }

  return window;
};

module.exports = { createWindow };
