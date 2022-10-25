// In the main process.
/* const { app, BrowserWindow } = require("electron");
const { ipcRenderer } = require("electron"); */
const { ipcMain } = require("electron");

const testMessage = async () => {
  /* let win = null;

  win = new BrowserWindow({ width: 800, height: 600 });
  console.log("tryna send message");
  win.webContents.send("ping", "whoooooooh yeah!");
  console.log("message sent!");

  win.loadURL("https://github.com").then(() => {
    console.log("tryna send message");
    win.webContents.send("ping", "whoooooooh yeah!");
    console.log("message sent!");
  });

  win.webContents.on("did-finish-load", () => {
    win.webContents.send("ping", "whoooooooh yeah!");
  }); */
};

module.exports = testMessage;

/* app.whenReady().then(() => {
  win = new BrowserWindow({ width: 800, height: 600 })
  win.loadURL(`xnxx.com`)
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('ping', 'whoooooooh yeah!')
  })
}) */
