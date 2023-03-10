const closingAutomationSystem = async (driver) => {
  if (driver && driver !== undefined) {
    await driver.quit();
  }
};

module.exports = closingAutomationSystem;
