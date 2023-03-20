// Library Imports
const { dialog, app, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
// Constants
const CHECK_FOR_UPDATE_PENDING = "checkForUpdatePending";
const CHECK_FOR_UPDATE_SUCCESS = "checkForUpdateSuccess";
const CHECK_FOR_UPDATE_FAILURE = "checkForUpdateFailure";

const DOWNLOAD_UPDATE_PENDING = "downloadUpdatePending";
const DOWNLOAD_UPDATE_SUCCESS = "downloadUpdateSuccess";
const DOWNLOAD_UPDATE_FAILURE = "downloadUpdateFailure";

const QUIT_AND_INSTALL_UPDATE = "quitAndInstallUpdate";

const updaterListener = () => {};

module.exports = {
  checkForUpdatePending: ipcMain.on(
    CHECK_FOR_UPDATE_PENDING,
    (event, message) => {
      const { sender } = event;
      const isDev = !app.isPackaged;

      // Automatically invoke success on development environment.
      if (isDev === true) {
        sender.send(DOWNLOAD_UPDATE_SUCCESS);
      } else {
        const result = autoUpdater.downloadUpdate();

        result
          .then(() => {
            sender.send(DOWNLOAD_UPDATE_SUCCESS);
          })
          .catch(() => {
            sender.send(DOWNLOAD_UPDATE_FAILURE);
          });
      }
    }
  ),

  downloadUpdatePending: ipcMain.on(
    DOWNLOAD_UPDATE_PENDING,
    (event, message) => {
      const { sender } = event;
      const isDev = !app.isPackaged;

      // Automatically invoke success on development environment.
      if (isDev === true) {
        sender.send(CHECK_FOR_UPDATE_SUCCESS);
      } else {
        const result = autoUpdater.checkForUpdates();

        /* 
        ! Look into the updateInfo paremeter below and see what it
        ! actually sends
        */

        result
          .then((checkResult) => {
            const { updateInfo } = checkResult;
            sender.send(CHECK_FOR_UPDATE_SUCCESS, updateInfo);
          })
          .catch(() => {
            sender.send(CHECK_FOR_UPDATE_FAILURE);
          });
      }
    }
  ),

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
