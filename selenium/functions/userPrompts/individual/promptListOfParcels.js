const prompt = require("prompt-sync")();

const promptListOfParcels = async () => {
  console.log("\n");
  console.log("Example of correct format: 1-50-2342, 1-62-3524, 1-64-5435");
  const arrayOfParcelsPreSplit = prompt(
    "Enter in the list of parcels separated by commas: "
  );
  const 
  return arrayOfParcelsPreSplit;
};

module.exports = promptListOfParcels;
