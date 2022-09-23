const prompt = require("prompt-sync")();

const promptFileOutputType = async () => {
  console.log("\n");
  const selectedFileOutputType = prompt(
    "Enter a number to select a file output format: "
  );
  return selectedFileOutputType;
};

module.exports = promptFileOutputType;
