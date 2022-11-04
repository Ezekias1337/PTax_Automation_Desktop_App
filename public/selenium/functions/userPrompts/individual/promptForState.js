const prompt = require("prompt-sync")();

const promptForState = async () => {
  console.log("\n");
  const selectedAutomationInput = prompt(
    "Enter a number to select a state: "
  );
  return selectedAutomationInput;
};

module.exports = promptForState;
