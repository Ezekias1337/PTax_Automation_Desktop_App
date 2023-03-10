// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../utils/waits/awaitElementLocatedAndReturn");
const sendKeysInputFields = require("../../../utils/web-elements/sendKeysInputFields");
// Selectors
const { uploadDocument } = require("../../../constants/selectors/allSelectors");

const enterYear = async (driver, year) => {
  const taxYearInput = await awaitElementLocatedAndReturn(
    driver,
    uploadDocument.taxYear,
    "id"
  );
  await sendKeysInputFields(taxYearInput, year, false);
};

module.exports = enterYear;
