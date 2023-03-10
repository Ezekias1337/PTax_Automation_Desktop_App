// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../general/awaitElementLocatedAndReturn");

const switchToTaxWebsiteIframe = async (driver, iframeSelector, method) => {
  const iframe = await awaitElementLocatedAndReturn(
    driver,
    iframeSelector,
    method
  );
  await driver.switchTo().frame(iframe);
};

module.exports = switchToTaxWebsiteIframe;
