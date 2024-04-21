/* 
  Let's front-end know that the chrome driver needs to be updated
*/

const sendChromeDriverNeedsUpdate = async (ipcBusClientNodeMain) => {
  await ipcBusClientNodeMain.send("send-chrome-driver-needs-update", null);
};

module.exports = sendChromeDriverNeedsUpdate;
