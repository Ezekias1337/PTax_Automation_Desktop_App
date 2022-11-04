const colors = require("colors");
const consoleLogLine = require("../consoleLogLine");
const closingAutomationSystem = require("../closingAutomationSystem");
const incorrectFilePathWarning = require("./incorrectFilePathWarning");

const filePathIncludesSpaces = async () => {
  consoleLogLine();

  console.log(
    colors.red.bold(
      "The filepath you entered includes spaces. You need to rename the filepath to not have spaces."
    )
  );
  console.log("\n");
  console.log("This is an example of what will not work: ");
  console.log("\n");

  console.log(
    colors.yellow.bold("C:/Users/user3/ Documents/Assessment Notices/")
  );
  console.log("\n");
  console.log("These are examples of what will work: ");

  console.log("\n");
  console.log(
    colors.green.bold("C:/Users/user3/Documents/Assessment_Notices/"),
    " or ",
    colors.green.bold("C:/Users/user3/Documents/AssessmentNotices/")
  );
  console.log("\n");
  incorrectFilePathWarning();
  console.log("\n");

  await closingAutomationSystem();

  return;
};

module.exports = filePathIncludesSpaces;
