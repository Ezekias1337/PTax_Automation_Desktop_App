// Library Imports
const { app, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
// Constants
const {
  CHECK_FOR_UPDATE_PENDING,
  CHECK_FOR_UPDATE_SUCCESS,
  CHECK_FOR_UPDATE_FAILURE,
  DOWNLOAD_UPDATE_PENDING,
  DOWNLOAD_UPDATE_SUCCESS,
  DOWNLOAD_UPDATE_FAILURE,
  QUIT_AND_INSTALL_UPDATE,
  UPDATE_INSTALLED_SUCCESS,
} = require("../../constants/updateActions");

module.exports = {
  checkForUpdatePending: ipcMain.on(
    CHECK_FOR_UPDATE_PENDING,
    (event, message) => {
      const { sender } = event;
      const isDev = !app.isPackaged;

      // Automatically invoke success on development environment.
      if (isDev === true) {
        sender.send(CHECK_FOR_UPDATE_SUCCESS);
      } else {
        const result = autoUpdater.checkForUpdates();

        result
          .then(() => {
            sender.send(CHECK_FOR_UPDATE_SUCCESS);
          })
          .catch(() => {
            sender.send(CHECK_FOR_UPDATE_FAILURE);
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
        sender.send(DOWNLOAD_UPDATE_SUCCESS);
      } else {
        const result = autoUpdater.downloadUpdate();

        result
          .then((checkResult) => {
            sender.send(DOWNLOAD_UPDATE_SUCCESS, checkResult);
          })
          .catch(() => {
            sender.send(DOWNLOAD_UPDATE_FAILURE);
          });
      }
    }
  ),

  quitAndInstall: ipcMain.on(QUIT_AND_INSTALL_UPDATE, (event, message) => {
    const { sender } = event;
    const isDev = !app.isPackaged;

    if (isDev === true) {
      sender.send(UPDATE_INSTALLED_SUCCESS);
    } else {
      autoUpdater.quitAndInstall(true, true);
    }
  }),
};
