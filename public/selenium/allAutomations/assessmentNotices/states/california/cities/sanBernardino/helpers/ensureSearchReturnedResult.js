// Functions, Helpers, Utils
const fluentWait = require("../../../../../../../functions/general/fluentWait");

const ensureSearchReturnedResult = async (
  driver,
  assessmentWebsiteSelectors
) => {
  let searchSuccessful;

  searchSuccessful = !(await fluentWait(
    driver,
    assessmentWebsiteSelectors.searchFailedWarning,
    "xpath",
    6,
    2
  ));
  return searchSuccessful;
};

module.exports = ensureSearchReturnedResult;
