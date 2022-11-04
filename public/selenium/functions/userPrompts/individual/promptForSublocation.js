const prompt = require("prompt-sync")();

const promptForSublocation = async () => {
  console.log("\n");
  const selectedSublocation = prompt(
    "Enter a number to select a sublocation: "
  );
  return selectedSublocation;
};

module.exports = promptForSublocation;
