// Library Imports
const { Key } = require("selenium-webdriver");
// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../../../../../functions/general/awaitElementLocatedAndReturn");
const scrollWindow = require("../../../../../../../functions/general/scrollWindow");

const searchForParcel = async (driver, item, assessmentWebsiteSelectors) => {
  await scrollWindow(driver, 0, 850);

  const searchByAPN = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.searchByAPN,
    "xpath"
  );
  await searchByAPN.click();

  /* 
    Need to remove unnecessary characters from parcelNumber 
    to pull up in DB
  */
  const parcelNumberOriginal = item.ParcelNumber;
  const parcelNumberSplit = parcelNumberOriginal.split("-");
  parcelNumberSplit.splice(3);
  const keysToSend = parcelNumberSplit.join("-");

  const searchBarElement = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.searchBar,
    "css"
  );
  await searchBarElement.sendKeys(Key.CONTROL, "a");
  await searchBarElement.sendKeys(Key.DELETE);
  await searchBarElement.sendKeys(keysToSend);
  await searchBarElement.sendKeys(Key.ENTER);
};

module.exports = searchForParcel;
