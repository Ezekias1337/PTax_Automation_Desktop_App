/* 
  Lets the front end know that the automation is complete
*/

const sendAutomationCompleted = async (ipcBusClientNodeMain) => {
  ipcBusClientNodeMain.send("send-automation-completed", null);
};

module.exports = sendAutomationCompleted;
