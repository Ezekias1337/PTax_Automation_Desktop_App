const { By } = require("selenium-webdriver");
const awaitElementLocatedAndReturn = require("../../../../../../../functions/general/awaitElementLocatedAndReturn");

const pullAssessmentStrings = async (
  driver,
  assessmentWebsiteSelectors,
  assessmentYear
) => {
  const tableToPullDataFrom = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.valueHistoryTable,
    "css"
  );
  const arrayOfTableRows = await tableToPullDataFrom.findElements(
    By.css("tbody tr")
  );

  /* 
    Get the correct row for the year entered by the user
  */
  let correctRowForScraping;
  let correctRowChildren;

  for (const row of arrayOfTableRows) {
    try {
      const arrayOfTdElements = await row.findElements(By.css("td"));
      const tdToCheckForMatch = arrayOfTdElements[0];

      const stringToCheckForMatch = await tdToCheckForMatch.getAttribute(
        "innerText"
      );
      if (stringToCheckForMatch === assessmentYear) {
        correctRowForScraping = row;
        correctRowChildren = arrayOfTdElements;
        break;
      }
    } catch (error) {}
  }

  /* 
    Now that we have the correct row, extract the values
  */

  /* 
    ----------------------------------Land----------------------------------
  */

  const landValueTd = correctRowChildren[7];
  const landMarketValueString = await landValueTd.getAttribute("innerText");
  const landMarketValueStringDollarSignRemoved = landMarketValueString.replace(
    "$",
    ""
  );
  const landMarketValueStringCommasRemoved =
    landMarketValueStringDollarSignRemoved.replace(/,/g, "");

  /* 
    -------------------------------Improvements-------------------------------
  */

  const improvementValueTd = correctRowChildren[8];
  const improvementMarketValueString = await improvementValueTd.getAttribute(
    "innerText"
  );

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
