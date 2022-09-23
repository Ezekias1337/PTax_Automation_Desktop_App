const fs = require("fs");
const prompt = require("prompt-sync")();
const consoleLogLine = require("../../general/consoleLogLine");

const promptFileName = async (uploadDirectory, fileTypeToFilterBy) => {
  consoleLogLine();
  const arrayOfFiles = fs.readdirSync(uploadDirectory);
  const arrayOfFilesWithIndex = [];

  const filterFileList = (fileTypeToFilterBy, setFilter) => {
    let counter = 1;
    if(arrayOfFiles.entries().length < 1) {
      console.log("There are no files in this directory.");
    }
    for (const [index, item] of arrayOfFiles.entries()) {
      const fileNameSplitByDot = item.split(".");
      if (
        fileNameSplitByDot &&
        fileNameSplitByDot[1] &&
        fileNameSplitByDot[1] === fileTypeToFilterBy &&
        setFilter === true
      ) {
        const arrayChunkToPush = [counter, item];
        console.log(arrayChunkToPush);
        arrayOfFilesWithIndex.push(arrayChunkToPush);
        counter = counter + 1;
      } else if (fileTypeToFilterBy === "all" || setFilter === false) {
        const arrayChunkToPush = [index + 1, item];
        console.log(arrayChunkToPush);
        arrayOfFilesWithIndex.push(arrayChunkToPush);
      }
    }
  };

  if (fileTypeToFilterBy !== "all") {
    switch (fileTypeToFilterBy) {
      case "xlsx":
        filterFileList("xlsx", true);
        break;
      case "pdf":
        filterFileList("pdf", true);
        break;
      default:
        console.log("Selected file extension not found in filter list");
    }
  } else {
    filterFileList("all", false);
  }

  consoleLogLine();

  const keyToFindFileName = prompt(
    "Enter the number corresponding to the file you wish to use: "
  );
  const fileNamePreParse = arrayOfFilesWithIndex.find(
    (arrayChunk) => arrayChunk[0].toString() === keyToFindFileName
  );
  const fileName = fileNamePreParse[1];

  return fileName;
};

module.exports = promptFileName;
