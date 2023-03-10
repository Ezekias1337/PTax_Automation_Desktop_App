const { ipcMain, dialog } = require("electron");
const {
  replaceForwardslashWithBackwardSlash,
} = require("../../../shared/utils/strings/replaceForwardslashWithBackwardSlash");

const promptForFile = async (defaultPath = null) => {
  let filePath;
  if (defaultPath === null) {
    filePath = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Spreadsheet Files", extensions: ["xlsx"] }],
    });
  } else {
    let defaultPathStringified = replaceForwardslashWithBackwardSlash(
      defaultPath.toString()
    );

    filePath = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Spreadsheet Files", extensions: ["xlsx"] }],
      defaultPath: defaultPathStringified,
    });
  }

  if (filePath === undefined) {
    return null;
  }

  return filePath;
};

module.exports = {
  filePathListener: ipcMain.on("filePrompted", (event, message) => {
    let promptForFileParams;

    if (message.length > 1) {
      promptForFileParams = message[1];
    } else {
      promptForFileParams = null;
    }

    promptForFile(promptForFileParams)
      .then((result) => {
        event.sender.send("filePathRetrieved", [result, message[0]]);
      })
      .catch((error) => {
        console.log(error);
      });
  }),
};
