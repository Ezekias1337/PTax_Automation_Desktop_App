const { ipcMain } = require("electron");
const { automation } = require("../../selenium/automation");

module.exports = {
  browserListener: ipcMain.on("launchBrowser", (event, message) => {
    automation(message);
    /* .then((resp) => {
        console.log("resp: ", resp);
      })
      .catch((error) => {
        console.log("error: ", error);
      }); */
  }),
};
