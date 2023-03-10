// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../utils/waits/awaitElementLocatedAndReturn");
// Selectors
const { uploadDocument } = require("../../../constants/selectors/allSelectors");

const chooseFileToUpload = async (driver, fullPathToUploadFile) => {
  /* 
    For selenium to upload a file in ptax you have to sendkeys of 
    the filename
  */

  const chooseFileButton = await awaitElementLocatedAndReturn(
    driver,
    uploadDocument.filePicker,
    "id"
  );

  await chooseFileButton.sendKeys(fullPathToUploadFile);
};

module.exports = chooseFileToUpload;
