const prompt = require("prompt-sync")();

const promptForOperation = async () => {
  console.log("\n");
  const selectedOperation = prompt(
    "Enter a number to select an operation: "
  );
  return selectedOperation;
};

module.exports = promptForOperation;
