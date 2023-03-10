const { uploadDocument } = require("../../../constants/selectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../../utils/waits/awaitElementLocatedAndReturn");

const enterTitle = async (driver, title) => {
  const titleElement = await awaitElementLocatedAndReturn(
    driver,
    uploadDocument.title,
    "id"
  );
  await titleElement.sendKeys(title);
};

module.exports = enterTitle;
