// Library Imports
const { Key } = require("selenium-webdriver");
// Functions, Helpers, Utils
const trimLeadingZeros = require("../../../../../utils/strings/trimLeadingZeros");
const awaitElementLocatedAndReturn = require("../../../../../utils/waits/awaitElementLocatedAndReturn");

const bblSearch = async (driver, item, assessmentWebsiteSelectors) => {
  /* 
        Some parcels have leading zeros in the block/lot numbers which cause them
        to not be pulled up on the database. This remedies that.
  */

  const boroughNumber = item.ParcelNumber.split("-")[0];
  const blockNumberPreZerotrim = item.ParcelNumber.split("-")[1];
  const blockNumber = trimLeadingZeros(blockNumberPreZerotrim);
  const lotNumberPreZerotrim = item.ParcelNumber.split("-")[2];
  const lotNumber = trimLeadingZeros(lotNumberPreZerotrim);

  if (boroughNumber === "1") {
    const burough1Element = await awaitElementLocatedAndReturn(
      driver,
      assessmentWebsiteSelectors.burough1,
      "xpath"
    );
    await burough1Element.click();
  } else if (boroughNumber === "2") {
    const burough2Element = await awaitElementLocatedAndReturn(
      driver,
      assessmentWebsiteSelectors.burough2,
      "xpath"
    );
    await burough2Element.click();
  } else if (boroughNumber === "3") {
    const burough3Element = await awaitElementLocatedAndReturn(
      driver,
      assessmentWebsiteSelectors.burough3,
      "xpath"
    );
    await burough3Element.click();
  } else if (boroughNumber === "4") {
    const burough4Element = await awaitElementLocatedAndReturn(
      driver,
      assessmentWebsiteSelectors.burough4,
      "xpath"
    );
    await burough4Element.click();
  } else if (boroughNumber === "5") {
    const burough5Element = await awaitElementLocatedAndReturn(
      driver,
      assessmentWebsiteSelectors.burough5,
      "xpath"
    );
    await burough5Element.click();
  }

  const blockInputFieldElement = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.blockInputField,
    "id"
  );
  await blockInputFieldElement.sendKeys(Key.CONTROL, "a");
  await blockInputFieldElement.sendKeys(Key.DELETE);
  await blockInputFieldElement.sendKeys(blockNumber);

  const lotInputFieldElement = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.lotInputField,
    "id"
  );
  await lotInputFieldElement.sendKeys(Key.CONTROL, "a");
  await lotInputFieldElement.sendKeys(Key.DELETE);
  await lotInputFieldElement.sendKeys(lotNumber);

  const taxWebsiteSearchBtn = await awaitElementLocatedAndReturn(
    driver,
    assessmentWebsiteSelectors.searchButton,
    "id"
  );

  await taxWebsiteSearchBtn.click();
};

module.exports = bblSearch;
