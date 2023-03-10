// Library Imports
const { Key } = require("selenium-webdriver");
// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../../../utils/waits/awaitElementLocatedAndReturn");

const searchForParcel = async (driver, item, assessmentWebsiteSelectors) => {
  const searchBarElement = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.searchBar,
    "xpath"
  );
  await searchBarElement.sendKeys(Key.CONTROL, "a");
  await searchBarElement.sendKeys(Key.DELETE);
  await searchBarElement.sendKeys(item.ParcelNumber);
  await searchBarElement.sendKeys(Key.ENTER);
};

module.exports = searchForParcel;
