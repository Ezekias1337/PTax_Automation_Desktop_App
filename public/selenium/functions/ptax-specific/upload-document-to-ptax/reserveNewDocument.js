const { until } = require("selenium-webdriver");
const simulateMouseHover = require("../../../utils/web-elements/simulateMouseHover");
const awaitElementLocatedAndReturn = require("../../../utils/waits/awaitElementLocatedAndReturn");
const swapToIFrame1 = require("../../ptax-specific/frame-swaps/swapToIFrame1");
const {
  reserveDocument,
} = require("../../../constants/selectors/allSelectors");

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
