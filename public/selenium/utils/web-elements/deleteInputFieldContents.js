// Library Imports
const { Key } = require("selenium-webdriver");

const deleteInputFieldContents = async (inputElement) => {
  try {
    await inputElement.sendKeys(Key.CONTROL, "a");
    await inputElement.sendKeys(Key.DELETE);
  } catch (error) {
    console.log(error, error.message);
  }
};

module.exports = deleteInputFieldContents;
