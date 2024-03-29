// Library Imports
const { dialog, app } = require("electron");
const { autoUpdater } = require("electron-updater");

module.exports = {
  updateDownloaded: autoUpdater.on(
    "update-downloaded",
    (_event, releaseNotes, releaseName) => {
      const dialogOpts = {
        type: "info",
        buttons: ["Restart", "Later"],
        title: "Application Update",
        message: process.platform === "win32" ? releaseNotes : releaseName,
        detail:
          "A new version has been downloaded. Restart the application to apply the updates.",
      };
      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) {
          autoUpdater.quitAndInstall();
          app.exit();
        }
      });
    }
  ),
};
