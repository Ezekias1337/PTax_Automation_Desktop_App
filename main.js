// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, nativeImage, ipcMain } = require("electron");
const path = require("path");
const Store = require("electron-store");
const { dialog } = require("electron");

let tray, window;

//app.dock.hide()
function createWindow() {
  // Create the browser window.
  console.log(screenWidth, screenHeight);
  console.log(screenXCoordinate, screenYCoordinate);
  if (isScreenPositionCustom === true) {
    window = new BrowserWindow({
      width: screenWidth,
      height: screenHeight,
      frame: true,
      fullscreenable: true,
      resizable: true,
      transparent: false,
      x: screenXCoordinate,
      y: screenYCoordinate,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: false,
        nodeIntegration: true,
      },
      icon: path.join(__dirname, "public/images/icon.ico"),
    });
  } else {
    window = new BrowserWindow({
      width: screenWidth,
      height: screenHeight,
      frame: true,
      fullscreenable: true,
      resizable: true,
      transparent: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        contextIsolation: false,
        nodeIntegration: true,
      },
      icon: path.join(__dirname, "public/images/icon.ico"),
    });
  }

  window.on("closed", () => (window = null));

  window.loadURL("http://localhost:3000");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

const createTray = () => {
  const iconPath = path.join(__dirname, "public/images/icon.ico");
  const icon = nativeImage.createFromPath(iconPath);

  tray = new Tray(icon);
  tray.on("click", (event) => toggleWindow());
};

const toggleWindow = () => {
  window.isVisible() ? window.hide() : showWindow();
};

const showWindow = () => {
  const position = windowPosition();
  if (process.platform === "darwin") {
    window.setPosition(position.x, position.y);
  }

  window.show();
};

const windowPosition = () => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );
  const y = Math.round(trayBounds.y + trayBounds.height);

  return { x, y };
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createTray();
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

let store = new Store();

//Handle Screen Resolution Preference

let screenWidth;
let screenHeight;
let screenData = store.get("userSettings.screenResolution");

if (
  typeof screenData === "string" &&
  screenData !== null &&
  screenData !== undefined
) {
  let screenResolutionSplit = store
    .get("userSettings.screenResolution")
    .split("x");
  screenWidth = parseInt(screenResolutionSplit[0]);
  screenHeight = parseInt(screenResolutionSplit[1]);
} else {
  screenWidth = 800;
  screenHeight = 600;
}

// Handle Screen Position Preference
let screenXCoordinate;
let screenYCoordinate;
let screenCoordinates;
let isScreenPositionCustom = store.get(
  "userSettings.launchWindowinCurrentPosition"
);
if (isScreenPositionCustom === true) {
  screenCoordinates = store.get(
    "userSettings.launchWindowinCurrentPositionvalue"
  );
  screenXCoordinate = parseInt(screenCoordinates.split("x")[0]);
  screenYCoordinate = parseInt(screenCoordinates.split("x")[1]);
} else if (isScreenPositionCustom === false) {
  store.delete("userSettings.launchWindowinCurrentPositionvalue");
}

const promptForFile = async () => {
  const filePath = await dialog.showOpenDialog({ properties: ["openFile"] });
  return filePath;
};

const promptForDirectory = async () => {
  const filePath = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return filePath;
};

ipcMain.on("filePrompted", (event, message) => {
  promptForFile().then((result) => {
    window.webContents.send("filePathRetrieved", [result, message]);
  });
});

ipcMain.on("directoryPrompted", (event, message) => {
  promptForDirectory().then((result) => {
    window.webContents.send("directoryPathRetrieved", [result, message]);
  });
});

console.log("Settings path: ", app.getPath("userData"));
