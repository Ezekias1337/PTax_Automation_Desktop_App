const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { handleResolutionPref } = require("./handleResolutionPref");
const { handlePositionPref } = require("./handlePositionPref");
const { maximizeWindow } = require("./maximizeWindow");
const { minimizeWindow } = require("./minimizeWindow");
const { closeWindow } = require("./closeWindow");

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
      },
      icon: path.join(directoryName, "public/images/icon.ico"),
    });
  }

  window.on("closed", () => (window = null));
  window.loadURL("http://localhost:3000");

  // Handle window toggling for custom titlebar
  ipcMain.on("windowMinimize", () => minimizeWindow(window));
  ipcMain.on("windowMaximize", () => maximizeWindow(window));
  ipcMain.on("windowClose", () => closeWindow(window));

  // Open the DevTools.
  // window.webContents.openDevTools()

  return window;
};

module.exports = { createWindow };
