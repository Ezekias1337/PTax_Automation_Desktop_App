const { Key, until, By } = require("selenium-webdriver");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");

/* 
    For some dumb reason ParcelQuests dropdown menus dont work like
    other websites. It's not possible to click on the desired element
    like normal.
    
    Instead, we click on the dropdown element, and keep hitting the
    arrow Keys until the selected option matches what we are looking 
    for.
*/

const getValueOfDropdownField = async (driver, inputFieldCssSelector) => {
  /* 
        During the function the element can become stale,
        by calling this for each iteration, we ensure
        no staleness error
    */
  const dropDownField = await awaitElementLocatedAndReturn(
    driver,
    inputFieldCssSelector,
    "css"
  );
  return dropDownField;
};

const handleParcelQuestDropdown = async (
  driver,
  countyName,
  inputFieldCssSelector,
  direction
) => {
  let dropDownFieldToManipulate = await getValueOfDropdownField(
    driver,
    inputFieldCssSelector
  );
  let dropDownFieldValue;

  /* 
    ! The input field seems to default to San Diego, CA. Based off the
    ! alphabetical order the script needs to go up or down the list. Will
    ! implement a sorting feature later to remove the direction parameter
    ! from this function
  */

  let arrowCodeKey;
  if (direction === "up") {
    arrowCodeKey = "\uE013";
  } else if (direction === "down") {
    arrowCodeKey = "\uE015";
  }

  // ! LAX IS HARDCODED FOR NOW, CHANGE LATER. LAX = LOS ANGELES

  while (dropDownFieldValue !== "LAX") {
    dropDownFieldToManipulate = await getValueOfDropdownField(
      driver,
      inputFieldCssSelector
    );
    await dropDownFieldToManipulate.click();

    await dropDownFieldToManipulate.sendKeys(arrowCodeKey);
    dropDownFieldValue = await dropDownFieldToManipulate.getAttribute("value");
    if (dropDownFieldValue !== "LAX") {
      await dropDownFieldToManipulate.sendKeys(Key.ENTER);
    } else {
      /* 
        Because the way this works, when the value is equal to what you
        are looking for, it means you went one past what you need, go 
        back one
      */
      if (direction === "up") {
        arrowCodeKey = "\uE015";
      } else if (direction === "down") {
        arrowCodeKey = "\uE013";
      }

      await dropDownFieldToManipulate.sendKeys(arrowCodeKey);
      await dropDownFieldToManipulate.sendKeys(Key.ENTER);
    }
  }
};

module.exports = handleParcelQuestDropdown;
