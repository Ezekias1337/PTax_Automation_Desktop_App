// Library Imports
const { Key } = require("selenium-webdriver");
// Functions, Helpers, Utils
const deleteInputFieldContents = require("./deleteInputFieldContents");

const sendKeysInputFields = async (
  chosenInputField,
  stringToSend,
  hitEnter
) => {
  try {
    await deleteInputFieldContents(chosenInputField);
    await chosenInputField.sendKeys(stringToSend);

    if (hitEnter === true) {
      await chosenInputField.sendKeys(Key.ENTER);
    }
  } catch (error) {
    console.log("Failed to send keys to input field in PTax");
    console.log(error, error.message);
  }
};

module.exports = sendKeysInputFields;
