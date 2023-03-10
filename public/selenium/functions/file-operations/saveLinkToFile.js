// Library Imports
const fs = require("fs");
const request = require("request");

const saveLinkToFile = async (
  anchorTag,
  outputDirectory,
  fileName,
  fileExtension
) => {
  let downloadSucceeded = false;
  try {
    const anchorTagToDownloadHREF = await anchorTag.getAttribute("href");
    const fileNameSpecialCharactersRemoved = fileName.replace("*", "");
    const destinationPath = `${outputDirectory}/${fileNameSpecialCharactersRemoved}.${fileExtension}`;

    request
      .get(anchorTagToDownloadHREF, { timeout: 20000 }, function (err) {
        return downloadSucceeded;
      })
      .pipe(fs.createWriteStream(destinationPath));
    downloadSucceeded = true;
    return downloadSucceeded;
  } catch (error) {
    return downloadSucceeded;
  }
};

module.exports = saveLinkToFile;
