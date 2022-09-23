const colors = require("colors");
const swapToIFrameDefaultContent = require("./swapToIFrameDefaultContent");
const awaitElementLocatedAndReturn = require("../../general/awaitElementLocatedAndReturn");

const swapToIFrame1 = async (driver) => {
  await swapToIFrameDefaultContent(driver);
  const iframe = await awaitElementLocatedAndReturn(driver, "#fmeMain", "css");
  await driver.switchTo().frame(iframe);
};

module.exports = swapToIFrame1;
