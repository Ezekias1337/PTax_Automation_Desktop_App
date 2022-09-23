const awaitElementLocatedAndReturn = require("../../../../../../../functions/general/awaitElementLocatedAndReturn");

const pullAssessmentStrings = async (
  driver,
  assessmentWebsiteSelectors,
) => {
  const landMarketValueElement = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.landMarketValue,
    "css"
  );
  const landMarketValueString = await landMarketValueElement.getAttribute(
    "innerText"
  );
  const landMarketValueStringCommasRemoved = landMarketValueString.replace(
    /,/g,
    ""
  );

  const improvementMarketValueElement = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.improvementMarketValue,
    "css"
  );
  const improvementMarketValueString =
    await improvementMarketValueElement.getAttribute("innerText");
  const improvementMarketValueStringCommasRemoved =
    improvementMarketValueString.replace(/,/g, "");

  console.log("landMarketValue: ", landMarketValueStringCommasRemoved);
  console.log(
    "improvementMarketValue: ",
    improvementMarketValueStringCommasRemoved
  );

  return [landMarketValueString, improvementMarketValueString];
};

module.exports = pullAssessmentStrings;
