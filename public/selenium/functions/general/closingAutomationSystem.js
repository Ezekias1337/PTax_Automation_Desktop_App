const colors = require("colors");

const closingAutomationSystem = async (driver) => {
  console.log(colors.red.bold("Closing Automation System."));

  if (driver && driver !== undefined) {
    await driver.quit();
  }
};

module.exports = closingAutomationSystem;
