// Library Imports
const { BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");
const path = require("path");
const url = require("url");
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

  console.log(
    "preload directory",
    path.join(directoryName, "preload.bundle.js")
  );

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
      icon: path.join(directoryName, "icon.ico"),
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
      icon: path.join(directoryName, "icon.ico"),
    });
  }

  window.on("closed", () => (window = null));

  if (isDev === true) {
    window.loadURL("http://localhost:3000");
  } else {
    window.loadURL(
      url.format({
        pathname: path.join(__dirname, "index.html"),
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

  if (isDev === false) {
    autoUpdater.checkForUpdates();
  }

  return window;
};

module.exports = { createWindow };
