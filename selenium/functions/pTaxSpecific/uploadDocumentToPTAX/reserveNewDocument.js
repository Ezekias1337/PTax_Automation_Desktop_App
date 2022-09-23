const { until } = require("selenium-webdriver");
const simulateMouseHover = require("../../general/simulateMouseHover");
const awaitElementLocatedAndReturn = require("../../../functions/general/awaitElementLocatedAndReturn");
const swapToIFrame1 = require("../../pTaxSpecific/frameSwaps/swapToIFrame1");
const {
  reserveDocument,
} = require("../../../ptaxXpathsAndSelectors/allSelectors");

const reserveNewDocument = async (driver) => {
  // Need to simulate mousehover over this element to dismiss navbar
  const reserveDocumentIDSpan = await awaitElementLocatedAndReturn(
    driver,
    reserveDocument.reserveDocumentIDSpan,
    "id"
  );
  await simulateMouseHover(driver, reserveDocumentIDSpan);
  await swapToIFrame1(driver);

  const reserveButton = await awaitElementLocatedAndReturn(
    driver,
    reserveDocument.reserveButton,
    "id"
  );
  await driver.wait(until.elementIsEnabled(reserveButton));
  await reserveButton.click();
};

module.exports = reserveNewDocument;
