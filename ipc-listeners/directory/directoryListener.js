const { ipcMain, dialog } = require("electron");

const promptForDirectory = async () => {
  const filePath = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  return filePath;
};

module.exports = {
  directoryListener: ipcMain.on("directoryPrompted", (event, message) => {
    promptForDirectory()
      .then((result) => {
        event.sender.send("directoryPathRetrieved", [result, message]);
      })
      .catch((error) => {
        console.log(error);
      });
  }),
};
