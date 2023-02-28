// Library Imports
const { until, By } = require("selenium-webdriver");
// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../../../../functions/general/generateDynamicXPath");

const pullAssessmentStrings = async (
  driver,
  assessmentWebsiteSelectors,
  assessmentYear,
  assessmentYearEnd
) => {
  const sideMenuTabElement = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.sideMenuTab,
    "id"
  );

  const stringForFinalValueTaxYear = `${assessmentYear}-${assessmentYearEnd}`;
  const sideBarFinalValueXPath = generateDynamicXPath(
    "span",
    stringForFinalValueTaxYear,
    "contains"
  );
  const sideBarFinalValueElement = await sideMenuTabElement.findElement(
    By.xpath(sideBarFinalValueXPath)
  );
  await sideBarFinalValueElement.click();
  await driver.wait(until.urlContains("asmt_"));

  const tableWithAssessmentData = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.assessmentInformation,
    "id"
  );

  const assessmentTableArrayOfRows = await tableWithAssessmentData.findElements(
    By.css("tr")
  );
  const estimatedMarketValueRow = assessmentTableArrayOfRows[1];
  const marketAVRow = assessmentTableArrayOfRows[2];

  const estimatedMarketValueTDs = await estimatedMarketValueRow.findElements(
    By.css("td")
  );
  const marketAVTDs = await marketAVRow.findElements(By.css("td"));

  const landMarketValueString = await estimatedMarketValueTDs[2].getAttribute(
    "innerText"
  );
  const landMarketValueStringCommasRemoved = landMarketValueString.replace(
    /,/g,
    ""
  );
  const landMarketValueInt = parseInt(landMarketValueStringCommasRemoved);

  //This is used to subtract landmarketvalue to get landAssessed value, nothing else
  const landTotalValueString = await estimatedMarketValueTDs[3].getAttribute(
    "innerText"
  );
  const landTotalValueStringCommasRemoved = landTotalValueString.replace(
    /,/g,
    ""
  );
  const landTotalValueInt = parseInt(landTotalValueStringCommasRemoved);

  //Now subtract marketvalue from total value to get assessed value
  const improvementMarketValueInt = landTotalValueInt - landMarketValueInt;
  const improvementMarketValueString = improvementMarketValueInt.toString();

  const landAssessedValueString = await marketAVTDs[2].getAttribute(
    "innerText"
  );

  const landAssessedValueStringCommasRemoved = landAssessedValueString.replace(
    /,/g,
    ""
  );
  const landAssessedValueInt = parseInt(landAssessedValueStringCommasRemoved);

  //This is used to subtract improvementmarketvalue to get improvementAssessed value, nothing else
  const improvementTotalValueString = await marketAVTDs[3].getAttribute(
    "innerText"
  );
  const improvementTotalValueStringCommasRemoved =
    improvementTotalValueString.replace(/,/g, "");
  const improvementTotalValueInt = parseInt(
    improvementTotalValueStringCommasRemoved
  );

  console.log("improvementTotalValueInt", improvementTotalValueInt);
  console.log("landAssessedValueInt", landAssessedValueInt);

  const improvementAssessedValueInt =
    improvementTotalValueInt - landAssessedValueInt;
  const improvementAssessedValueString = improvementAssessedValueInt.toString();

  return [
    landMarketValueString,
    landAssessedValueString,
    improvementMarketValueString,
    improvementAssessedValueString,
  ];
};

module.exports = pullAssessmentStrings;
