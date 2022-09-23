const {
  uploadDocument,
} = require("../../../ptaxXpathsAndSelectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../general/awaitElementLocatedAndReturn");

const clickSaveDocumentToPTAXButton = async (driver) => {
  const saveButton = await awaitElementLocatedAndReturn(
    driver,
    uploadDocument.saveButton,
    "id"
  );
  await saveButton.click();
};

module.exports = clickSaveDocumentToPTAXButton;
