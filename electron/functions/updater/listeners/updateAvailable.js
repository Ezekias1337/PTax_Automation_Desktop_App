// Library Imports
const { dialog } = require("electron");
const { autoUpdater } = require("electron-updater");

module.exports = {
  updateAvailable: autoUpdater.on(
    "update-available",
    (_event, releaseNotes, releaseName) => {
      const dialogOpts = {
        type: "info",
        buttons: ["Install Update"],
        title: "Application Update",
        message: process.platform === "win32" ? releaseNotes : releaseName,
        detail: "A new version is being downloaded.",
      };
      dialog.showMessageBox(dialogOpts, (response) => {});
    }
  ),
};
