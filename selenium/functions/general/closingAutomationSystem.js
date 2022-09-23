const colors = require("colors");

const closingAutomationSystem = async (driver) => {
  console.log(colors.red.bold("Closing Automation System."));

  if (driver && driver !== undefined) {
    await driver.close();
  }
};

module.exports = closingAutomationSystem;
