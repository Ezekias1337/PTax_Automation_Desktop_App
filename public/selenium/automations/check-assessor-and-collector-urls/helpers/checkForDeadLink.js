// Functions, Helpers, Utils
const fluentElementLocatedAndReturn = require("../../../utils/waits/fluentElementLocatedAndReturn");
// Selectors
const checkAssessorAndCollectorUrlsSelectors = require("../../../constants/selectors/check-assessor-and-collector-urls-selectors/checkAssessorAndCollectorUrlsSelectors");

const checkForDeadLink = async (driver) => {
  try {
    const isLinkDead = await fluentElementLocatedAndReturn(
      driver,
      checkAssessorAndCollectorUrlsSelectors.deadLink,
      "css",
      5,
      1
    );

    if (isLinkDead === null) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

module.exports = checkForDeadLink;
