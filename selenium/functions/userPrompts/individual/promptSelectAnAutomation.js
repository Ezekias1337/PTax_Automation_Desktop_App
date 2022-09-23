const prompt = require("prompt-sync")();

const promptSelectAnAutomation = async () => {
  console.log("\n");
  const selectedAutomationInput = prompt(
    "Enter a number to select an automation to run: "
  );
  return selectedAutomationInput;
};

module.exports = promptSelectAnAutomation;
