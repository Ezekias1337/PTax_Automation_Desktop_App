const prompt = require("prompt-sync")();

const promptForInstallmentNumber = async () => {
  console.log("\n");
  const selectedFileOutputType = prompt(
    "Enter a number to select an installment number: "
  );
  return selectedFileOutputType;
};

module.exports = promptForInstallmentNumber;
