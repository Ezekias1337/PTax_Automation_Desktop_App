const testSelenium = async () => {
  const { Builder, By, Key, until } = require("selenium-webdriver");
  const chrome = require("selenium-webdriver/chrome");

  driver = await new Builder().forBrowser("chrome").build();
  await driver.get("https://google.com");
  await driver.sleep(5000);
  await driver.close();
};

module.exports = { testSelenium };
