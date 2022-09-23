const fs = require("fs");
const request = require("request");

const saveLinkToFile = async (
  anchorTag,
  outputDirectory,
  fileName,
  fileExtension
) => {
  const anchorTagToDownloadHREF = await anchorTag.getAttribute("href");
  let downloadSucceeded = false;
  const fileNameSpecialCharactersRemoved = fileName.replace("*", "");

  request
    .get(anchorTagToDownloadHREF, { timeout: 20000 }, function (err) {
      return downloadSucceeded;
    })
    .pipe(
      fs.createWriteStream(
        `${outputDirectory}${fileNameSpecialCharactersRemoved}.${fileExtension}`
      )
    );
  downloadSucceeded = true;
  return downloadSucceeded;
};

module.exports = saveLinkToFile;
