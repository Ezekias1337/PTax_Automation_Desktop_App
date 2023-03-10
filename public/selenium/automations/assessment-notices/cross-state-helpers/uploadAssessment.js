// Functions, Helpers, Utils
const chooseFileToUpload = require("../../../functions/ptax-specific/upload-document-to-ptax/chooseFileToUpload");
const enterTitle = require("../../../functions/ptax-specific/upload-document-to-ptax/enterTitle");
const selectDocType = require("../../../functions/ptax-specific/upload-document-to-ptax/selectDocType");
const clickSaveDocumentToPTAXButton = require("../../../functions/ptax-specific/upload-document-to-ptax/clickSaveDocumentToPTAXButton");
const goToUploadDocumentPage = require("../../../functions/ptax-specific/upload-document-to-ptax/goToUploadDocumentPage");
const selectAssessmentDropdown = require("../../../functions/ptax-specific/upload-document-to-ptax/selectAssessmentDropdown");
const enterYear = require("../../../functions/ptax-specific/upload-document-to-ptax/enterYear");

const {
  replaceForwardslashWithBackwardSlash,
} = require("../../../../shared/utils/strings/replaceForwardslashWithBackwardSlash");

const uploadAssessment = async (
  driver,
  fileNameForFile,
  year,
  assessmentYearEnd,
  uploadDirectory,
  documentTitle = "Online Annual"
) => {
  /* 
    Have to artificially slow this down, because selenium goes too fast
    for the DOM to update and gets stuck otherwise
  */

  let outputDirectorySlashesInverted =
    replaceForwardslashWithBackwardSlash(uploadDirectory);

  let fullPathToUploadFile = outputDirectorySlashesInverted;
  fullPathToUploadFile += "\\";
  fullPathToUploadFile += `${fileNameForFile}.pdf`;

  await driver.sleep(5000);
  await goToUploadDocumentPage(driver);
  await chooseFileToUpload(driver, fullPathToUploadFile);
  await driver.sleep(3000);
  await enterYear(driver, year);
  await driver.sleep(3000);
  await selectAssessmentDropdown(driver, assessmentYearEnd);
  await driver.sleep(3000);
  await selectDocType(driver, "Assessment Notice");
  await driver.sleep(3000);
  await enterTitle(driver, documentTitle);
  await driver.sleep(3000);
  await clickSaveDocumentToPTAXButton(driver);
  await driver.sleep(3000);
  await clickSaveDocumentToPTAXButton(driver);
};

module.exports = uploadAssessment;
