// Library Imports
const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
// Functions, Helpers, and Utils
const handleAutomationCancel = require("../ipc-bus/handleAutomationCancel");
const sendMessageToFrontEnd = require("../ipc-bus/sendMessage/sendMessageToFrontEnd");

const buildDriver = async (ipcBusClientNodeMain) => {
  await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
    primaryMessage: "Opening browser window...",
    messageColor: "regular",
    errorMessage: null,
  });

  const options = new chrome.Options();
  const driver = await new Builder()
    .setChromeOptions(options)
    .forBrowser("chrome")
    .build();
  await driver.manage().window().maximize();

  handleAutomationCancel(ipcBusClientNodeMain, driver);
  await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
    primaryMessage: "Browser window opened",
    messageColor: "regular",
    errorMessage: null,
  });
  return driver;
};

module.exports = buildDriver;
