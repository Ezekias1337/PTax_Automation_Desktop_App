const colors = require("colors");

const swapToIFrameDefaultContent = async (driver) => {
  await driver.switchTo().defaultContent();
};

module.exports = swapToIFrameDefaultContent;
