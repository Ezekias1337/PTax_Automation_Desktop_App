const awaitElementLocatedAndReturn = require("../../../../../../../functions/general/awaitElementLocatedAndReturn");
const { Key } = require("selenium-webdriver");

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
