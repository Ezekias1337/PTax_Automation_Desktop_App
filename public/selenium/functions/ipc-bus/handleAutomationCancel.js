// Functions
const closingAutomationSystem = require("../driver/closingAutomationSystem");

/* 
    Handles closing browser when user press stop button from
    the front end
*/

const handleAutomationCancel = (ipcBusClientNodeMain, driver) => {
  ipcBusClientNodeMain.addListener(
    "cancel-automation",
    async (ipcBusEvent, msg) => {
      await closingAutomationSystem(driver, ipcBusClientNodeMain);
    }
  );
};

module.exports = handleAutomationCancel;
