// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../../../../../functions/general/awaitElementLocatedAndReturn");

const pressNewSearch = async (driver, assessmentWebsiteSelectors) => {
  const newSearchBtn = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.newSearch,
    "css",
    true
  );
  await newSearchBtn.click();
};

module.exports = pressNewSearch;
