// Functions, Helpers, Utils
const fluentElementLocatedAndReturn = require("../../../utils/waits/fluentElementLocatedAndReturn");
// Selectors
const checkAssessorAndCollectorUrlsSelectors = require("../../../constants/selectors/check-assessor-and-collector-urls-selectors/checkAssessorAndCollectorUrlsSelectors");

const checkForPageMoved = async (driver) => {
  let isPageMoved = false;

  try {
    const pageMovedElement = await fluentElementLocatedAndReturn(
      driver,
      checkAssessorAndCollectorUrlsSelectors.pageMoved,
      "xpath",
      5,
      1
    );

    if (pageMovedElement !== null) {
      isPageMoved = true;
    }
  } catch (error) {}

  try {
    const fourOFourElement = await fluentElementLocatedAndReturn(
      driver,
      checkAssessorAndCollectorUrlsSelectors.fourOFour,
      "xpath",
      5,
      1
    );

    if (fourOFourElement !== null) {
      isPageMoved = true;
    }
  } catch (error) {}

  return isPageMoved;
};

module.exports = checkForPageMoved;
