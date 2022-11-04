const { By } = require("selenium-webdriver");
const locateTaxRollTable = require("./locateTaxRollTable");
const locateImprovementValueRow = require("./locateImprovementValueRow");
const locateLandValueRow = require("./locateLandValueRow");

const pullAssessmentStrings = async (driver, assessmentWebsiteSelectors) => {
  const tableToPullDataFrom = await locateTaxRollTable(
    driver,
    assessmentWebsiteSelectors
  );
  const arrayOfTableRows = await tableToPullDataFrom.findElements(By.css("tr"));
  
  /* 
    ----------------------------------Land----------------------------------
  */

  const landValueRow = await locateLandValueRow(arrayOfTableRows);
  const landValueRowChildren = await landValueRow.findElements(By.css("td"));
  const landMarketValueElement = landValueRowChildren[1];
  
  const landMarketValueString = await landMarketValueElement.getAttribute(
    "innerText"
  );
  const landMarketValueStringDollarSignRemoved = landMarketValueString.replace(
    "$",
    ""
  );
  const landMarketValueStringCommasRemoved =
    landMarketValueStringDollarSignRemoved.replace(/,/g, "");

  /* 
    -------------------------------Improvements-------------------------------
  */

  const improvementsValueRow = await locateImprovementValueRow(
    arrayOfTableRows
  );
  const improvementsValueRowChildren = await improvementsValueRow.findElements(
    By.css("td")
  );
  const improvementMarketValueElement = improvementsValueRowChildren[1];

  const improvementMarketValueString =
    await improvementMarketValueElement.getAttribute("innerText");

  const improvementMarketValueStringDollarSignRemoved =
    improvementMarketValueString.replace("$", "");

  const improvementMarketValueStringCommasRemoved =
    improvementMarketValueStringDollarSignRemoved.replace(/,/g, "");

  console.log("landMarketValue: ", landMarketValueStringCommasRemoved);
  console.log(
    "improvementMarketValue: ",
    improvementMarketValueStringCommasRemoved
  );

  return [landMarketValueString, improvementMarketValueString];
};

module.exports = pullAssessmentStrings;
