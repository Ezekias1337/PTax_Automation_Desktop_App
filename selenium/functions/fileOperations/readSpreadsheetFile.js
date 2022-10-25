const xlsx = require("xlsx");
const colors = require("colors");
const promptUploadOrScanDirectory = require("../userPrompts/individual/promptUploadDirectory");
const promptFileName = require("../userPrompts/individual/promptFileName");
const removeQuotesFromObjectKeys = require("../general/removeQuotesFromObjectKeys");

const readSpreadsheetFile = async (uploadDirectory) => {
  console.log(
    "\n",
    colors.red.bold(
      "Ensure to remove any rows above the row with the titles of each column. Otherwise, this will not work."
    )
  );

  /* const uploadDirectoryPreSlashCheck = await promptUploadOrScanDirectory();
  const slashChecker = uploadDirectoryPreSlashCheck.charAt(
    uploadDirectoryPreSlashCheck.length - 1
  );

  let uploadDirectory = "";

  if (slashChecker === "/" || slashChecker === "\\") {
    uploadDirectory = uploadDirectoryPreSlashCheck;
  } else {
    uploadDirectory = uploadDirectoryPreSlashCheck + "\\";
  } */

  console.log(
    colors.green.bold(
      "Ensure the spreadsheet only has one page to work properly."
    )
  );
  const fileName = await promptFileName(uploadDirectory, "xlsx");
  const fileNameConcatenated = uploadDirectory.concat(fileName);
  const fileNameBackSlashesSwapped = fileNameConcatenated.replace(/\\/g, "/");
  console.log("\n");
  console.log("Using file: ", colors.green.bold(fileNameBackSlashesSwapped));
  console.log("\n");

  let workbook = xlsx.readFile(fileNameBackSlashesSwapped);
  let sheetNameList = workbook.SheetNames;
  let worksheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

  const arrayOfObjects = [];

  for (const item of Object.entries(worksheet)) {
    const arrayOfObjectsKeysParsed = removeQuotesFromObjectKeys(item[1]);
    arrayOfObjects.push(arrayOfObjectsKeysParsed);
  }

  return arrayOfObjects;
};

module.exports = readSpreadsheetFile;
