// Functions
const closingAutomationSystem = require("../functions/general/closingAutomationSystem");

/* 
    Handles closing browser when user press stop button from
    the front end
*/

const handleAutomationCancel = (ipcBusClientNodeMain, driver) => {
  ipcBusClientNodeMain.addListener(
    "cancel-automation",
    async (ipcBusEvent, greetingMsg) => {
      await closingAutomationSystem(driver);
    }
  );
};

module.exports = handleAutomationCancel;
