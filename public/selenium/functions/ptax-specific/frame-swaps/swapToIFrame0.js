const swapToIFrameDefaultContent = require("./swapToIFrameDefaultContent");
const awaitElementLocatedAndReturn = require("../../../utils/waits/awaitElementLocatedAndReturn");

const swapToIFrame0 = async (driver) => {
  await swapToIFrameDefaultContent(driver);
  const iframe = await awaitElementLocatedAndReturn(driver, "#fmeTree", "css");
  await driver.switchTo().frame(iframe);
};

module.exports = swapToIFrame0;
