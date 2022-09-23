const prompt = require("prompt-sync")();

const promptForYear = async () => {
  console.log("\n");
  const selectedYear = prompt("Enter a four digit year to select: ");
  return selectedYear;
};

module.exports = promptForYear;
