/* 
  Let's front-end know that there was an unknown error
*/

const sendUnknownError = async (ipcBusClientNodeMain, errorMessage) => {
  await ipcBusClientNodeMain.send("send-unknown-error", errorMessage);
};

module.exports = sendUnknownError
