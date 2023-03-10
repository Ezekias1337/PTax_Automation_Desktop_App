const switchToTaxWebsiteTab = async (driver, taxWebsiteWindow) => {
  await driver.switchTo ().window (taxWebsiteWindow);
};

module.exports = switchToTaxWebsiteTab;