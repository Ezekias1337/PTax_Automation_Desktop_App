/* 
  Sends the current iteration information to react,
  so it can be displayed
*/

const sendCurrentIterationInfo = async (
  ipcBusClientNodeMain,
  currentIterationInfo
) => {
  ipcBusClientNodeMain.send("current-iteration-info", currentIterationInfo);
};

module.exports = sendCurrentIterationInfo;
