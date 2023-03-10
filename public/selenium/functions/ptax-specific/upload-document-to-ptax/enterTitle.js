// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../utils/waits/awaitElementLocatedAndReturn");
// Selectors
const { uploadDocument } = require("../../../constants/selectors/allSelectors");

const enterTitle = async (driver, title) => {
  const titleElement = await awaitElementLocatedAndReturn(
    driver,
    uploadDocument.title,
    "id"
  );
  await titleElement.sendKeys(title);
};

module.exports = enterTitle;
