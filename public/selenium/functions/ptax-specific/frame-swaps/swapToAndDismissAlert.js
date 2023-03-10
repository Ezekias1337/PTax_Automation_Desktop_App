// Library Imports
const colors = require("colors");

const swapToAndDismissAlert = async (driver) => {
  await driver.sleep(2000);
  let alert = await driver.switchTo().alert();
  let alertText = await alert.getText();
  await alert.accept();

  console.log("\n");
  console.log(
    colors.yellow.bold(
      "Successfully switched to alert, retrieved it's text, and dismissed."
    )
  );

  return alertText;
};

module.exports = swapToAndDismissAlert;
