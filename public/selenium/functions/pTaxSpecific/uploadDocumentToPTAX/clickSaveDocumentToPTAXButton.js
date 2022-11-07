const {
  uploadDocument,
} = require("../../../ptaxXpathsAndSelectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../general/awaitElementLocatedAndReturn");
const scrollElementIntoView = require("../../general/scrollElementIntoView");

const clickSaveDocumentToPTAXButton = async (driver) => {
  const saveButton = await awaitElementLocatedAndReturn(
    driver,
    uploadDocument.saveButton,
    "id"
  );
  await scrollElementIntoView(driver, saveButton);
  await driver.sleep(2500);
  await saveButton.click();
};

module.exports = clickSaveDocumentToPTAXButton;
