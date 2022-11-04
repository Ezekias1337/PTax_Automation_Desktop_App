const { Key } = require("selenium-webdriver");

const sendKeysPTaxInputFields = async (
  chosenInputField,
  stringToSend,
  hitEnter
) => {
  try {
    await chosenInputField.sendKeys(Key.CONTROL, "a");
    await chosenInputField.sendKeys(Key.DELETE);
    await chosenInputField.sendKeys(stringToSend);

    if (hitEnter && hitEnter === true) {
      await chosenInputField.sendKeys(Key.ENTER);
    }
  } catch (error) {
    console.log("Failed to send keys to input field in PTax");
    console.log(error, error.message);
  }
};

module.exports = sendKeysPTaxInputFields;
