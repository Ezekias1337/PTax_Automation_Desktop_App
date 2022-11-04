const {
  uploadDocument,
} = require("../../../ptaxXpathsAndSelectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../general/awaitElementLocatedAndReturn");

const enterTitle = async (driver, title) => {
  const titleElement = await awaitElementLocatedAndReturn(
    driver,
    uploadDocument.title,
    "id"
  );
  await titleElement.sendKeys(title);
};

module.exports = enterTitle;
