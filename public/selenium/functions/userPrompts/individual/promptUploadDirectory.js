const colors = require("colors");
const prompt = require("prompt-sync")();
const filePathIncludesSpaces = require("../../general/consoleLogErrors/filePathIncludesSpaces");
const filePathDoesntContainSlashes = require("../../general/consoleLogErrors/filePathDoesntContainSlashes");
const filePathIsRelative = require("../../general/consoleLogErrors/filePathIsRelative");

/* 
    NOTE: NEED TO SPECIFY THAT THIS WON'T WORK FOR DIRECTORIES THAT HAVE
    SPACES IN THEM
*/

const promptUploadOrScanDirectory = async (uploadOrScan = "scan") => {
  console.log("\n");
  console.log(
    colors.yellow.bold("This automation requires uploading or scanning files.")
  );
  console.log("\n");
  console.log(
    colors.red.bold("Beware, this will not work if the filepath has spaces!")
  );
  console.log("\n");

  let promptText;
  if (uploadOrScan === "scan") {
    promptText =
      "Enter the filepath to the location of the file(s) to check for spreadsheets: ";
  } else if (uploadOrScan === "upload") {
    promptText =
      "Enter the filepath to the location of the file(s) to upload to PTax: ";
  }

  let selectedUploadDirectory = prompt(promptText);

  if (selectedUploadDirectory.includes(" ")) {
    filePathIncludesSpaces();
  }
  if (
    selectedUploadDirectory.includes("./") ||
    selectedUploadDirectory.includes("../")
  ) {
    filePathIsRelative();
  }

  if (
    !(
      selectedUploadDirectory.includes("/") ||
      selectedUploadDirectory.includes("\\")
    )
  ) {
    filePathDoesntContainSlashes();
  }

  /* 
    Make sure there is a slash at the end of the string
  */
  let directoryStrLength = selectedUploadDirectory.length;
  let selectedUploadDirectoryLastChar =
    selectedUploadDirectory[directoryStrLength - 1];
  if (selectedUploadDirectoryLastChar !== "/") {
    selectedUploadDirectory = `${selectedUploadDirectory}/`;
  }

  return selectedUploadDirectory;
};

module.exports = promptUploadOrScanDirectory;
