const chooseFileToUpload = require("../../../functions/pTaxSpecific/uploadDocumentToPTAX/chooseFileToUpload");
const enterTitle = require("../../../functions/pTaxSpecific/uploadDocumentToPTAX/enterTitle");
const selectDocType = require("../../../functions/pTaxSpecific/uploadDocumentToPTAX/selectDocType");
const clickSaveDocumentToPTAXButton = require("../../../functions/pTaxSpecific/uploadDocumentToPTAX/clickSaveDocumentToPTAXButton");
const goToUploadDocumentPage = require("../../../functions/pTaxSpecific/uploadDocumentToPTAX/goToUploadDocumentPage");
const selectAssessmentDropdown = require("../../../functions/pTaxSpecific/uploadDocumentToPTAX/selectAssessmentDropdown");
const enterYear = require("../../../functions/pTaxSpecific/uploadDocumentToPTAX/enterYear");
const {
  replaceForwardslashWithBackwardSlash,
} = require("../../../../shared/utils/replaceForwardslashWithBackwardSlash");

const uploadTaxBill = async (
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

  await driver.sleep(10000);
  await goToUploadDocumentPage(driver);
  await chooseFileToUpload(driver, fullPathToUploadFile);
  await driver.sleep(3000);
  await enterYear(driver, year);
  await driver.sleep(3000);
  await selectAssessmentDropdown(driver, assessmentYearEnd);
  await driver.sleep(3000);
  await selectDocType(driver, "Tax Bill");
  await driver.sleep(3000);
  await enterTitle(driver, documentTitle);
  await driver.sleep(3000);
  await clickSaveDocumentToPTAXButton(driver);
  await driver.sleep(3000);
  await clickSaveDocumentToPTAXButton(driver);
};

module.exports = uploadTaxBill;
