// Library Imports
const { By } = require("selenium-webdriver");
// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../../../../../functions/general/awaitElementLocatedAndReturn");

const pullAssessmentStrings = async (driver, assessmentWebsiteSelectors) => {
  let landValueRow;
  let structureValueRow;

  /* 
    Since there is no ID or stable XPath to get these values, the 
    table must be parsed
  */
  const valueHistoryTable = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.valueHistoryTable,
    "css"
  );
  const valueHistoryTableBody = await valueHistoryTable.findElement(
    By.css("tbody")
  );
  const valueHistoryTableRows = await valueHistoryTableBody.findElements(
    By.css("tr")
  );

  /* 
    Find the TR with land/structures value
  */

  for (const item of valueHistoryTableRows) {
    try {
      const arrayOfRowTDs = await item.findElements(By.css("td"));
      const firstRowTD = arrayOfRowTDs[0];
      const arrayOfSpanChildren = await firstRowTD.findElements(By.css("span"));
      const spanWithSpanChild = arrayOfSpanChildren[1];
      const lastChild = await spanWithSpanChild.findElements(By.css("span"));

      const elementToCheckForMatch = lastChild[0];
      const stringToCheckForMatch = await elementToCheckForMatch.getAttribute(
        "innerText"
      );

      if (stringToCheckForMatch === "Land") {
        landValueRow = item;
      } else if (stringToCheckForMatch === "Structures") {
        structureValueRow = item;
      }
    } catch (error) {}
  }

  /* 
    Parse Land Value Data
  */
  let landMarketValueStringCommasRemoved;
  let improvementMarketValueStringCommasRemoved;

  if (landValueRow === undefined) {
    landMarketValueStringCommasRemoved = "0";
  } else {
    const landValueRowTDs = await landValueRow.findElements(By.css("td"));
    const landTDWithData = landValueRowTDs[1];
    const landTDWithDataSpanChildren = await landTDWithData.findElements(
      By.css("span")
    );
    const lastLandSpanParent = landTDWithDataSpanChildren[2];
    const finalLandSpanElement = await lastLandSpanParent.findElements(
      By.css("span")
    );

    const landMarketValueElement = finalLandSpanElement[0];
    const landMarketValueString = await landMarketValueElement.getAttribute(
      "innerText"
    );
    const landMarketValueStringDollarSignRemoved =
      landMarketValueString.replace("$", "");
    landMarketValueStringCommasRemoved =
      landMarketValueStringDollarSignRemoved.replace(/,/g, "");
  }

  /* 
    Parse Improvements Value Data
  */

  if (structureValueRow === undefined) {
    improvementMarketValueStringCommasRemoved = "0";
  } else {
    const improvementValueRowTDs = await structureValueRow.findElements(
      By.css("td")
    );
    const improvementTDWithData = improvementValueRowTDs[1];
    const improvementTDWithDataSpanChildren =
      await improvementTDWithData.findElements(By.css("span"));
    const lastImprovementSpanParent = improvementTDWithDataSpanChildren[2];
    const finalImprovementSpanElement =
      await lastImprovementSpanParent.findElements(By.css("span"));
    const improvementMarketValueElement = finalImprovementSpanElement[0];

    const improvementMarketValueString =
      await improvementMarketValueElement.getAttribute("innerText");
    const improvementMarketValueStringDollarSignRemoved =
      improvementMarketValueString.replace("$", "");

    improvementMarketValueStringCommasRemoved =
      improvementMarketValueStringDollarSignRemoved.replace(/,/g, "");
  }

  console.log("landMarketValue: ", landMarketValueStringCommasRemoved);
  console.log(
    "improvementMarketValue: ",
    improvementMarketValueStringCommasRemoved
  );

  return [
    landMarketValueStringCommasRemoved,
    improvementMarketValueStringCommasRemoved,
  ];
};

module.exports = pullAssessmentStrings;
