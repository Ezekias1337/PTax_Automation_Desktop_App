const colors = require("colors");
const consoleLogLine = require("../consoleLogLine");
const closingAutomationSystem = require("../closingAutomationSystem");

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
