const { ipcMain } = require("electron");
const { testSelenium } = require("../../selenium/testSelenium");

module.exports = {
  browserListener: ipcMain.on("launchBrowser", (event, message) => {
    testSelenium();
    /* .then((resp) => {
        console.log("resp: ", resp);
      })
      .catch((error) => {
        console.log("error: ", error);
      }); */
  }),
};
