const {
  uploadDocument,
} = require("../../../ptaxXpathsAndSelectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../general/awaitElementLocatedAndReturn");

const chooseFileToUpload = async (driver, fullPathToUploadFile) => {
  /* 
    For selenium to upload file you have to sendkeys of the filename, declaring 
    part of string to concat in string literal below 
  */

  const chooseFileButton = await awaitElementLocatedAndReturn(
    driver,
    uploadDocument.filePicker,
    "id"
  );

  await chooseFileButton.sendKeys(fullPathToUploadFile);
};

module.exports = chooseFileToUpload;
