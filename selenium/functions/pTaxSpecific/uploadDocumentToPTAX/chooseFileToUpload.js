const {
  uploadDocument,
} = require("../../../ptaxXpathsAndSelectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../general/awaitElementLocatedAndReturn");

const chooseFileToUpload = async (driver, fileNameForFile, outputDirectory) => {
  /* 
    For selenium to upload file you have to sendkeys of the filename, declaring 
    part of string to concat in string literal below 
  */

  const chooseFileButton = await awaitElementLocatedAndReturn(
    driver,
    uploadDocument.filePicker,
    "id"
  );

  await chooseFileButton.sendKeys(`${outputDirectory + fileNameForFile}.pdf`);
};

module.exports = chooseFileToUpload;
