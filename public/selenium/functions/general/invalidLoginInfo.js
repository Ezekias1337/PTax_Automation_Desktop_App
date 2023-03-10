// Library Imports
const colors = require("colors");
// Functions, Helpers, Utils
const consoleLogLine = require("../general/consoleLogLine");
const closingAutomationSystem = require("../driver/closingAutomationSystem");

const invalidLoginInfo = async (driver) => {
  consoleLogLine();

  console.log(
    colors.red.bold(
      "The login information you entered is not correct. Remember that it is case sensitive. Try again."
    )
  );
  console.log("\n");

  await closingAutomationSystem(driver);
  consoleLogLine();

  return;
};

module.exports = invalidLoginInfo;
