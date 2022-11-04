// Library imports
const { ipcMain, dialog } = require("electron");
// Functions, Helpers, and Utils
const {
  replaceForwardslashWithBackwardSlash,
} = require("../../../../shared/utils/replaceForwardslashWithBackwardSlash");

const promptForDirectory = async (defaultPath = null) => {
  let filePath;
  if (defaultPath === null) {
    filePath = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
  } else {
    let defaultPathStringified = replaceForwardslashWithBackwardSlash(
      defaultPath.toString()
    );

    filePath = await dialog.showOpenDialog({
      properties: ["openDirectory"],
      defaultPath: defaultPathStringified,
    });
  }

  return filePath;
};

module.exports = {
  directoryListener: ipcMain.on("directoryPrompted", (event, message) => {
    let promptForFileParams;

    if (message.length > 1) {
      promptForFileParams = message[1];
    } else {
      promptForFileParams = null;
    }

    promptForDirectory(promptForFileParams)
      .then((result) => {
        event.sender.send("directoryPathRetrieved", [result, message[0]]);
      })
      .catch((error) => {
        console.log(error);
      });
  }),
};
