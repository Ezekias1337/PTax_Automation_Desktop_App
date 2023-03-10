// Library Imports
const { until } = require("selenium-webdriver");
// Functions, Helpers, Utils
const swapToIFrameDefaultContent = require("../../frame-swaps/swapToIFrameDefaultContent");

const awaitElementLocatedAndReturn = require("../../../../utils/waits/awaitElementLocatedAndReturn");
// Selectors
const {
  navbarReportsSelectors,
} = require("../../../../constants/selectors/allSelectors");

const reportsNavbarClick = async (driver, subOption) => {
  try {
    await swapToIFrameDefaultContent(driver);

    //Click on report element in navbar
    const reportsTabOfNavbar = await awaitElementLocatedAndReturn(
      driver,
      navbarReportsSelectors.tab,
      "xpath"
    );
    await reportsTabOfNavbar.click();

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
    await reportsNavbarClick(driver, subOption);
  }
};

module.exports = reportsNavbarClick;
