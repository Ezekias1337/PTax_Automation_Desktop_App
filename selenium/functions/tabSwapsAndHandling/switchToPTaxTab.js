const switchToPTaxTab = async (driver, ptaxWindow) => {
  await driver.switchTo ().window (ptaxWindow);
};

module.exports = switchToPTaxTab;