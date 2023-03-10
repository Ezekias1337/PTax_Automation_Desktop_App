// Library Imports
const { until } = require("selenium-webdriver");
// Functions, Helpers, Utils
const swapToIFrameDefaultContent = require("../../frame-swaps/swapToIFrameDefaultContent");

const awaitElementLocatedAndReturn = require("../../../../utils/waits/awaitElementLocatedAndReturn");
// Selectors
const {
  navbarViewSelectors,
} = require("../../../../constants/selectors/allSelectors");

const viewNavbarClick = async (driver, subOption) => {
  try {
    await swapToIFrameDefaultContent(driver);

    //Click on view element in navbar
    const viewTabOfNavbar = await awaitElementLocatedAndReturn(
      driver,
      navbarViewSelectors.tab,
      "xpath"
    );
    await viewTabOfNavbar.click();

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
    await viewNavbarClick(driver, subOption);
  }
};

module.exports = viewNavbarClick;
