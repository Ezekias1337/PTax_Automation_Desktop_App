const { By } = require("selenium-webdriver");
const generateDynamicXPath = require("../../functions/general/generateDynamicXPath");
const awaitElementLocatedAndReturn = require("../../functions/general/awaitElementLocatedAndReturn");
const scrollElementIntoView = require("../../functions/general/scrollElementIntoView");
/*
 * Dropdown selector is an ID in this case, will refactor later
 * to accept other selectors
 *
 * When two dropdown elements have the same option text on the
 * same page, this function breaks. You have too use a more
 * specific selector for all after the first. Hence, the last
 * two parameters
 */

const selectDropdownElement = async (
  driver,
  dropdownSelector,
  desiredOptionText,
  areDuplicatesWithDesiredText = false,
  avoidDuplicatesSelector = null
) => {
  const dropdownElement = await awaitElementLocatedAndReturn(
    driver,
    dropdownSelector,
    "id"
  );
  await scrollElementIntoView(driver, dropdownElement);

  let desiredOptionElement;
  if (areDuplicatesWithDesiredText === false) {
    const desiredOptionXPath = generateDynamicXPath(
      "option",
      desiredOptionText,
      "contains"
    );
    desiredOptionElement = await dropdownElement.findElement(
      By.xpath(desiredOptionXPath)
    );
    await scrollElementIntoView(driver, desiredOptionElement);
    await desiredOptionElement.click();
  } else {
    desiredOptionElement = await awaitElementLocatedAndReturn(
      driver,
      avoidDuplicatesSelector,
      "css"
    );
    await scrollElementIntoView(driver, desiredOptionElement);
    await desiredOptionElement.click();
  }
};

module.exports = selectDropdownElement;
