const trimLeadingZeros = require("../../../../../functions/general/trimLeadingZeros");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");

const bblSearch = async (driver, item, taxWebsiteSelectors) => {
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
      taxWebsiteSelectors.burough1,
      "xpath"
    );
    await burough1Element.click();
  } else if (boroughNumber === "2") {
    const burough2Element = await awaitElementLocatedAndReturn(
      driver,
      taxWebsiteSelectors.burough2,
      "xpath"
    );
    await burough2Element.click();
  } else if (boroughNumber === "3") {
    const burough3Element = await awaitElementLocatedAndReturn(
      driver,
      taxWebsiteSelectors.burough3,
      "xpath"
    );
    await burough3Element.click();
  } else if (boroughNumber === "4") {
    const burough4Element = await awaitElementLocatedAndReturn(
      driver,
      taxWebsiteSelectors.burough4,
      "xpath"
    );
    await burough4Element.click();
  } else if (boroughNumber === "5") {
    const burough5Element = await awaitElementLocatedAndReturn(
      driver,
      taxWebsiteSelectors.burough5,
      "xpath"
    );
    await burough5Element.click();
  }

  const blockInputFieldElement = await awaitElementLocatedAndReturn(
    driver,
    taxWebsiteSelectors.blockInputField,
    "id"
  );
  await blockInputFieldElement.sendKeys(blockNumber);

  const lotInputFieldElement = await awaitElementLocatedAndReturn(
    driver,
    taxWebsiteSelectors.lotInputField,
    "id"
  );
  await lotInputFieldElement.sendKeys(lotNumber);

  const taxWebsiteSearchBtn = await awaitElementLocatedAndReturn(
    driver,
    taxWebsiteSelectors.searchButton,
    "id"
  );

  await taxWebsiteSearchBtn.click();
};

module.exports = bblSearch;
