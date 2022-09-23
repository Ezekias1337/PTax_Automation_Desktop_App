const colors = require("colors");

const consoleLogLine = () => {
  console.log("\n");
  console.log(
    colors.yellow.bold(
      "-------------------------------------------------------------------------------------------"
    )
  );
  console.log("\n");
};

module.exports = consoleLogLine;
