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

const createWindow = (directoryName, isUpdaterWindow, store, isDev) => {
  try {
    if (isUpdaterWindow === true) {
      let updaterWindow = null;
      const updaterWindowOptions = {
        width: 400,
        height: 400,
        frame: false,
        fullscreenable: true,
        resizable: false,
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

      updaterWindow = new BrowserWindow(updaterWindowOptions);
      updaterWindow.on("closed", () => (updaterWindow = null));
      if (isDev === true) {
        updaterWindow.loadURL("http://localhost:3000");
      } else {
        updaterWindow.loadURL(
          url.format({
            pathname: path.join(directoryName, "index.html"),
            protocol: "file:",
            slashes: true,
          })
        );
      }

      return updaterWindow;
    } else if (isUpdaterWindow === false) {
      let mainWindow = null;

      const [screenWidth, screenHeight] = handleResolutionPref(store);
      const [screenXCoordinate, screenYCoordinate, isScreenPositionCustom] =
        handlePositionPref(store);

      const mainBrowserWindowOptions = {
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

      // Create the browser mainWindow.
      if (isScreenPositionCustom === true) {
        mainBrowserWindowOptions.x = screenXCoordinate;
        mainBrowserWindowOptions.y = screenYCoordinate;
      }
      mainWindow = new BrowserWindow(mainBrowserWindowOptions);
      mainWindow.on("closed", () => (mainWindow = null));

      if (isDev === true) {
        mainWindow.loadURL("http://localhost:3000");
      } else {
        mainWindow.loadURL(
          url.format({
            pathname: path.join(directoryName, "index.html"),
            protocol: "file:",
            slashes: true,
          })
        );
      }

      // Handle mainWindow toggling for custom titlebar
      ipcMain.on("windowMinimize", () => minimizeWindow(mainWindow));
      ipcMain.on("windowMaximize", () => maximizeWindow(mainWindow));
      ipcMain.on("windowClose", () => closeWindow(mainWindow));

      return mainWindow;
    }
  } catch (error) {
    log.info("CREATE WINDOW ERROR INSIDE FUNCTION: ", error);
  }
};

module.exports = { createWindow };
