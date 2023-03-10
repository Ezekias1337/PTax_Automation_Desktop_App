// Library Imports
const { By } = require("selenium-webdriver");

const clickOnSelectOption = async (driver, selectElement, selector) => {
  try {
    const optionToClick = await selectElement.findElement(By.xpath(selector));
    await optionToClick.click();
    await driver.sleep(500);
  } catch (error) {
    console.log("Failed to click on select option");
    console.log(error, error.message);
  }
};

module.exports = clickOnSelectOption;
