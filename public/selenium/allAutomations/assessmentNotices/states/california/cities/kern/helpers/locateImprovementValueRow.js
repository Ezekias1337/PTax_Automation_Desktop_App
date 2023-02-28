// Library Imports
const { By } = require("selenium-webdriver");

const locateImprovementValueRow = async (arrayOfRows) => {
  let correctRow = null;

  for (const item of arrayOfRows) {
    try {
      const rowChildren = await item.findElements(By.css("td"));
      const firstCell = rowChildren[0];
      const textToCheck = await firstCell.getAttribute("innerText");
      if (textToCheck.includes("Improvement Value")) {
        correctRow = item;
      }
    } catch (error) {}
  }

  return correctRow;
};

module.exports = locateImprovementValueRow;
