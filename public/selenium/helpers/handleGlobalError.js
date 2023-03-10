// Functions, Helpers, and Utils
const sendMessageToFrontEnd = require("../functions/ipc-bus/sendMessage/sendMessageToFrontEnd");

const handleGlobalError = async (ipcBusClientNodeMain, errorMessage) => {
  if (errorMessage === "(intermediate value) is not iterable") {
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage:
        "There is a mismatch between your google chrome version and the version of the chrome webdriver. Visit https://chromedriver.chromium.org/home to download the version that matches with your chrome version (make sure to pick chromedriver_win32.zip), and extract it to C:/Windows",
      messageColor: "red",
      errorMessage: null,
    });
  } else {
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: errorMessage,
      messageColor: "red",
      errorMessage: null,
    });
  }
};

module.exports = handleGlobalError;
