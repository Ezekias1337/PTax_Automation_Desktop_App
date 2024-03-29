// Library Imports
const { until } = require("selenium-webdriver");
// Functions, Helpers, Utils
const swapToIFrameDefaultContent = require("../../frame-swaps/swapToIFrameDefaultContent");

const awaitElementLocatedAndReturn = require("../../../../utils/waits/awaitElementLocatedAndReturn");
// Selectors
const {
  navbarAppealsSelectors,
} = require("../../../../constants/selectors/allSelectors");

const appealsNavbarClick = async (driver, subOption) => {
  try {
    await swapToIFrameDefaultContent(driver);

    //Click on appeals element in navbar
    const appealsTabOfNavbar = await awaitElementLocatedAndReturn(
      driver,
      navbarAppealsSelectors.tab,
      "xpath"
    );
    await appealsTabOfNavbar.click();

    //wait until the dropdown is interactable, then click
    await driver.sleep(1500);
    const subOptionElement = await awaitElementLocatedAndReturn(
      driver,
      subOption,
      "xpath"
    );
    driver.wait(until.elementIsEnabled(subOptionElement));
    await subOptionElement.click();
  } catch (error) {
    // Retry incase it fails
    await appealsNavbarClick(driver, subOption);
  }
};

module.exports = appealsNavbarClick;
