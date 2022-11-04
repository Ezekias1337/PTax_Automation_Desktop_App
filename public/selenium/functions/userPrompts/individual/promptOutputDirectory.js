const prompt = require("prompt-sync")();

/* 
    NOTE: NEED TO SPECIFY THAT THIS WON'T WORK FOR DIRECTORIES THAT HAVE
    SPACES IN THEM
*/

const promptOutputDirectory = async () => {
  console.log("\n");
  const outputDirectoryPreSlashCheck = prompt(
    "Enter the path to the location you would like to save the files in: "
  );

  const slashChecker = outputDirectoryPreSlashCheck.charAt(
    outputDirectoryPreSlashCheck.length - 1
  );

  let outputDirectory = "";

  if (slashChecker === "/" || slashChecker === "\\") {
    outputDirectory = outputDirectoryPreSlashCheck;
  } else {
    outputDirectory = outputDirectoryPreSlashCheck + "\\";
  }

  return outputDirectory;
};

module.exports = promptOutputDirectory;
