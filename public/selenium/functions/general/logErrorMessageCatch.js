const colors = require("colors");
const consoleLogLine = require("./consoleLogLine");

const logErrorMessageCatch = (error) => {
  console.log(
    colors.red.bold(`The automation failed for the following reason:`),
    `${error}. Please contact the author if this error persists.`
  );

  consoleLogLine();
};

module.exports = logErrorMessageCatch;
