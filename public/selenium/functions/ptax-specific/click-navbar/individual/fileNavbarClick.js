// Library Imports
const { until } = require("selenium-webdriver");
// Functions, Helpers, Utils
const swapToIFrameDefaultContent = require("../../frame-swaps/swapToIFrameDefaultContent");

const awaitElementLocatedAndReturn = require("../../../../utils/waits/awaitElementLocatedAndReturn");
// Selectors
const {
  navbarFileSelectors,
} = require("../../../../constants/selectors/allSelectors");

const fileNavbarClick = async (driver, subOption) => {
  try {
    await swapToIFrameDefaultContent(driver);

    //Click on file element in navbar
    const fileTabOfNavbar = await awaitElementLocatedAndReturn(
      driver,
      navbarFileSelectors.tab,
      "xpath"
    );
    await fileTabOfNavbar.click();

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
    await fileNavbarClick(driver, subOption);
  }
};

module.exports = fileNavbarClick;
