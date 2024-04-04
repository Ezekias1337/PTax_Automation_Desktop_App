// Library Imports
const path = require("path");
const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

//const test = require("../../../../webdriver/chromedriver-win64/chromedriver.exe");
// Functions, Helpers, and Utils
const handleAutomationCancel = require("../ipc-bus/handleAutomationCancel");
const sendMessageToFrontEnd = require("../ipc-bus/sendMessage/sendMessageToFrontEnd");

const buildDriver = async (ipcBusClientNodeMain) => {
  await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
    primaryMessage: "Opening browser window...",
    messageColor: "regular",
    errorMessage: null,
  });

  let driver;

  try {
    const chromeDriverPath = path.join(
      __dirname,
      "../../../../webdriver/chromedriver-win64/chromedriver.exe"
    );

    const options = new chrome.Options().setChromeBinaryPath(chromeDriverPath);
    driver = await new Builder()
      .setChromeOptions(options)
      .forBrowser("chrome")
      .build();
  } catch (error) {
    console.error("Error building driver:", error);
    throw error; // Rethrow the error to handle it upstream
  }
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
