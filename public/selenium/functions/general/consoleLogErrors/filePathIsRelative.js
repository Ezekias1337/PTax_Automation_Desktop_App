const colors = require("colors");
const consoleLogLine = require("../consoleLogLine");
const closingAutomationSystem = require("../closingAutomationSystem");
const incorrectFilePathWarning = require("./incorrectFilePathWarning");

const filePathIsRelative = async () => {
  consoleLogLine();

  console.log(
    colors.red.bold(
      "The filepath you entered is relative. Relative filepaths are not valid. You must use the absoulte filepath."
    )
  );
  console.log("\n");
  console.log("This is an example of what will not work: ");
  console.log("\n");

  console.log(colors.yellow.bold("../Documents/Assessment_Notices/"));
  console.log("\n");
  console.log("This is an example of what will work: ");

  console.log("\n");
  console.log(
    colors.green.bold("C:/Users/user3/Documents/Assessment_Notices/")
  );
  console.log("\n");
  incorrectFilePathWarning();
  console.log("\n");

  await closingAutomationSystem();

  return;
};

module.exports = filePathIsRelative;
