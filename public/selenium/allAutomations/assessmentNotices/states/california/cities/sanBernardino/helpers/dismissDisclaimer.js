// Library Imports
const { By } = require("selenium-webdriver");
// Functions, Helpers, Utils
const fluentWait = require("../../../../../../../functions/general/fluentWait");

const dismissDisclaimer = async (driver, assessmentWebsiteSelectors) => {
  try {
    const disclaimerIsPresent = await fluentWait(
      driver,
      assessmentWebsiteSelectors.acceptDisclaimer,
      "xpath",
      10,
      2,
      "No disclaimer modal to dismiss"
    );
    if (disclaimerIsPresent === true) {
      const agreeButton = await driver.findElement(
        By.xpath(assessmentWebsiteSelectors.acceptDisclaimer)
      );

      await agreeButton.click();
    }
  } catch (error) {
    console.log("No disclaimer modal to dismiss. Ended in catch block.");
  }
};

module.exports = dismissDisclaimer;
