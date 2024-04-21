/* 
  Let's front-end know that the chrome is not installed or is corrupted
*/

const sendChromeNotInstalled = async (ipcBusClientNodeMain) => {
  await ipcBusClientNodeMain.send("send-chrome-not-installed", null);
};

module.exports = sendChromeNotInstalled;
