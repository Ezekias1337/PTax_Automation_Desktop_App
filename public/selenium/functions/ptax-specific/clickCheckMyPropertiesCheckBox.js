const awaitElementLocatedAndReturn = require("../../utils/waits/awaitElementLocatedAndReturn");
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
