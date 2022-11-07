/* 
  Sends information to the event log in react
*/

const sendEventLogInfo = async (ipcBusClientNodeMain, eventLogObj) => {
  ipcBusClientNodeMain.send("event-log-update", eventLogObj);
};

module.exports = sendEventLogInfo;
