const awaitElementLocatedAndReturn = require("../../general/awaitElementLocatedAndReturn");
const { checkBoxSelector } = require("../../../ptaxXpathsAndSelectors/allSelectors");

const clickCheckMyPropertiesCheckBox = async (driver) => {
  const checkBox = await awaitElementLocatedAndReturn(driver, checkBoxSelector, "id");
  await checkBox.click();
};

module.exports = clickCheckMyPropertiesCheckBox;
