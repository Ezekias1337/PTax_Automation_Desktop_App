// Library Imports
const { By } = require("selenium-webdriver");

const checkIfCorrectParentTable = async (tableToCheck) => {
  let isCorrectTable;

  try {
    const isParentTableConfirmationText = await tableToCheck.getAttribute(
      "innerText"
    );

    if (
      isParentTableConfirmationText.includes(
        "Current tax roll values that are used to calculate the bills due in December 2022"
      )
    ) {
      isCorrectTable = true;
    } else {
      isCorrectTable = false;
    }
  } catch (error) {
    isCorrectTable = false;
  }

  return isCorrectTable;
};

const locateTaxRollTable = async (driver, assessmentWebsiteSelectors) => {
  /* 
    This website does not use a consistent template,
    and the table with the data does not have an ID
    so this function will find it
  */
  const arrayOfPossibleParentTables = await driver.findElements(
    By.css(assessmentWebsiteSelectors.tableForScraping)
  );
  let parentTable;
  for (const item of arrayOfPossibleParentTables) {
    const isParentTable = await checkIfCorrectParentTable(item);
    if (isParentTable === true) {
      parentTable = item;
    }
  }
  return parentTable;
};

module.exports = locateTaxRollTable;
