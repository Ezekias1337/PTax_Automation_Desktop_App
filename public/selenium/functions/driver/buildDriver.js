// Library Imports
const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const buildDriver = async () => {
  let options = new chrome.Options();

  let driver = await new Builder()
    .setChromeOptions(options)
    .forBrowser("chrome")
    .build();
  await driver.manage().window().maximize();
  return driver;
};

module.exports = buildDriver;
