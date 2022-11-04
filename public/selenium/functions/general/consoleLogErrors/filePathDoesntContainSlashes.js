const colors = require("colors");
const consoleLogLine = require("../consoleLogLine");
const closingAutomationSystem = require("../closingAutomationSystem");
const incorrectFilePathWarning = require("./incorrectFilePathWarning");

const filePathDoesntContainSlashes = async () => {
  consoleLogLine();

  console.log(
    colors.red.bold(
      "The filepath you entered does not contain any slashes. This is an invalid filepath."
    )
  );
  console.log("\n");
  console.log("This is an example of what will not work: ");
  console.log("\n");

  console.log(colors.yellow.bold("Documents Assessment Notices"));
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

module.exports = filePathDoesntContainSlashes;
