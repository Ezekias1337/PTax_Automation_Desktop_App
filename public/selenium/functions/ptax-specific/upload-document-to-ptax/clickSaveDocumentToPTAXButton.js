// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../utils/waits/awaitElementLocatedAndReturn");
const scrollElementIntoView = require("../../../utils/web-elements/scrollElementIntoView");
// Selectors
const { uploadDocument } = require("../../../constants/selectors/allSelectors");

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
