// Library Imports
const { Key } = require("selenium-webdriver");
// Functions, Helpers, Utils
const handleParcelQuestDropdown = require("../helpers/handleParcelQuestDropdown");

const awaitElementLocatedAndReturn = require("../../../../../utils/waits/awaitElementLocatedAndReturn");
const fluentWait = require("../../../../../utils/waits/fluentWait");

const searchForParcel = async (
  driver,
  parcelNumber,
  county,
  selectors,
  direction
) => {
  try {
    await handleParcelQuestDropdown(
      driver,
      county,
      selectors.countyInputField,
      direction
    );

    const parcelNumberInput = await awaitElementLocatedAndReturn(
      driver,
      selectors.parcelInputField,
      "css"
    );
    await parcelNumberInput.sendKeys(Key.CONTROL, "a");
    await parcelNumberInput.sendKeys(Key.DELETE);
    await parcelNumberInput.sendKeys(parcelNumber);

    const parcelQuestSearchButton = await awaitElementLocatedAndReturn(
      driver,
      selectors.parcelQuestSearchButton,
      "css"
    );
    await parcelQuestSearchButton.click();

    /* 
      Check if loading bar is stuck
    */

    let loadingBarElement = await awaitElementLocatedAndReturn(
      driver,
      selectors.loadingBar,
      "css"
    );
    let loadingBarElementStyle = await loadingBarElement.getAttribute("style");
    while (!loadingBarElementStyle.includes("none")) {
      await driver.sleep(3000);

      loadingBarElement = await awaitElementLocatedAndReturn(
        driver,
        selectors.loadingBar,
        "css"
      );
      loadingBarElementStyle = await loadingBarElement.getAttribute("style");

      await parcelQuestSearchButton.click();
    }

    /* 
      Check if no results from Database    
      fluentWait here because script will get stuck if there
      is no results
    */
    const resultsPresent = await fluentWait(
      driver,
      selectors.parcelQuestViewResultsButton,
      "css",
      10,
      2
    );
    if (resultsPresent === false) {
      return false;
    }

    /* 
      Sometimes the viewresults button is not interactable,
      even though it's in the DOM, will retry if it fails
    */

    const viewResultsButton = await awaitElementLocatedAndReturn(
      driver,
      selectors.parcelQuestViewResultsButton,
      "css"
    );

    try {
      await viewResultsButton.click();
    } catch (error) {
      await driver.sleep(15000);
      try {
        await viewResultsButton.click();
      } catch (nestedError) {
        try {
          await driver.sleep(15000);
          await viewResultsButton.click();
        } catch (nestedNestedError) {
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = searchForParcel;
