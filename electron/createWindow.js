const { BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { createTray } = require("./createTray");
const { handleResolutionPref } = require("./handleResolutionPref");
const { handlePositionPref } = require("./handlePositionPref");
const { maximizeWindow } = require("./maximizeWindow");
const { minimizeWindow } = require("./minimizeWindow");
const { closeWindow } = require("./closeWindow");

const createWindow = (window, tray, directoryName, process, store) => {
  const [screenWidth, screenHeight] = handleResolutionPref(store);
  const [screenXCoordinate, screenYCoordinate, isScreenPositionCustom] =
    handlePositionPref(store);

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
        preload: path.join(directoryName, "preload.js"),
        contextIsolation: false,
        nodeIntegration: true,
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
        preload: path.join(directoryName, "preload.js"),
        contextIsolation: false,
        nodeIntegration: true,
      },
      icon: path.join(directoryName, "public/images/icon.ico"),
    });
  }

  window.on("closed", () => (window = null));
  window.loadURL("http://localhost:3000");
  if (tray === undefined) {
    createTray(window, tray, directoryName, process);
  }

  // Handle window toggling for custom titlebar
  ipcMain.on("windowMinimize", () => minimizeWindow(window));
  ipcMain.on("windowMaximize", () => maximizeWindow(window));
  ipcMain.on("windowClose", () => closeWindow(window));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
};

module.exports = { createWindow };
