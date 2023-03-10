// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../utils/waits/awaitElementLocatedAndReturn");
// Selectors
const { checkBoxSelector } = require("../../constants/selectors/allSelectors");

const clickCheckMyPropertiesCheckBox = async (driver) => {
  const checkBox = await awaitElementLocatedAndReturn(
    driver,
    checkBoxSelector,
    "id"
  );
  await checkBox.click();
};

module.exports = clickCheckMyPropertiesCheckBox;
