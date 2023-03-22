/* 
  Sends information to the event log in react
*/

const sendEventLogInfo = async (ipcBusClientNodeMain, eventLogObj) => {
  await ipcBusClientNodeMain.send("event-log-update", eventLogObj);
};

module.exports = sendEventLogInfo;
