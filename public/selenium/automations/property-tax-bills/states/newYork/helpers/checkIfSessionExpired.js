// Library Imports
const { By } = require("selenium-webdriver");

const checkIfSessionExpired = async (driver, taxWebsiteSelectors) => {
  const checkURL = await driver.getCurrentUrl();
  if (checkURL.includes(".aspx?mode=content/home.htm")) {
    const bblSearchBtn = await driver.findElement(
      By.xpath(taxWebsiteSelectors.bblSearchBtn)
    );
    await bblSearchBtn.click();
  }
};

module.exports = checkIfSessionExpired;
