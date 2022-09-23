const awaitElementLocatedAndReturn = require("../../../../../../../functions/general/awaitElementLocatedAndReturn");
const { Key } = require("selenium-webdriver");

const searchForParcel = async (driver, item, assessmentWebsiteSelectors) => {
  /* 
    Parcel Numbers have dashes in them on ptax, but only pull up on
    the website when you take them out.
  */

  let parcelNumber = item.ParcelNumber;
  const stringToSend = parcelNumber.split("-").join("");

  /* 
    Due to the way the website is built, there can often be an
    element not interactable error on the search bar.
    
    In the case that this occurrs, the script will simply retry
    recursively.
  */

  try {
    const displaySearchBarElement = await awaitElementLocatedAndReturn(
      driver,
      assessmentWebsiteSelectors.displaySearchBar,
      "xpath"
    );
    await displaySearchBarElement.click();

    const searchBarElement = await awaitElementLocatedAndReturn(
      driver,
      assessmentWebsiteSelectors.searchBar,
      "css"
    );
    await searchBarElement.sendKeys(Key.CONTROL, "a");
    await searchBarElement.sendKeys(Key.DELETE);
    await searchBarElement.sendKeys(stringToSend);

    /* 
      The San Bernardino site has anti-scraping measures and won't
      return results unless it is artificially slowed down.
    */

    await driver.sleep(5000);

    const submitSearchBtn = await awaitElementLocatedAndReturn(
      driver,
      assessmentWebsiteSelectors.submitSearchBtn,
      "xpath"
    );
    await submitSearchBtn.click();
  } catch (error) {
    await searchForParcel(driver, item, assessmentWebsiteSelectors);
  }
};

module.exports = searchForParcel;
