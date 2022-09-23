const { ipcMain } = require("electron");
const { automation } = require("../../selenium/automation.s");

module.exports = {
  browserListener: ipcMain.on("launchBrowser", (event, message) => {
    automation();
    /* .then((resp) => {
        console.log("resp: ", resp);
      })
      .catch((error) => {
        console.log("error: ", error);
      }); */
  }),
};
