const { ipcMain, dialog } = require("electron");

const promptForFile = async () => {
  const filePath = await dialog.showOpenDialog({ properties: ["openFile"] });
  return filePath;
};

module.exports = {
  filePathListener: ipcMain.on("filePrompted", (event, message) => {
    promptForFile()
      .then((result) => {
        event.sender.send("filePathRetrieved", [result, message]);
      })
      .catch((error) => {
        console.log(error);
      });
  }),
};
