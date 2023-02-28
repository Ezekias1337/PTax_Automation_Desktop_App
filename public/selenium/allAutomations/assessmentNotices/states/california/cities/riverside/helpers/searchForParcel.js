// Library Imports
const { Key } = require("selenium-webdriver");
// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../../../../../functions/general/awaitElementLocatedAndReturn");

const searchForParcel = async (driver, item, assessmentWebsiteSelectors) => {
  /* 
    This site takes a while to load the search bar, which can make this
    fail. So in the catch block it'll wait 10 seconds and try again before
    proceeding.
  */

  try {
    const searchBarElement = await awaitElementLocatedAndReturn(
      driver,
      assessmentWebsiteSelectors.searchBar,
      "css"
    );
    await searchBarElement.sendKeys(Key.CONTROL, "a");
    await searchBarElement.sendKeys(Key.DELETE);
    await searchBarElement.sendKeys(item.ParcelNumber);
    await searchBarElement.sendKeys(Key.ENTER);
  } catch (error) {
    await driver.sleep(10000);
    const searchBarElement = await awaitElementLocatedAndReturn(
      driver,
      assessmentWebsiteSelectors.searchBar,
      "css"
    );
    await searchBarElement.sendKeys(Key.CONTROL, "a");
    await searchBarElement.sendKeys(Key.DELETE);
    await searchBarElement.sendKeys(item.ParcelNumber);
    await searchBarElement.sendKeys(Key.ENTER);
  }
};

module.exports = searchForParcel;
