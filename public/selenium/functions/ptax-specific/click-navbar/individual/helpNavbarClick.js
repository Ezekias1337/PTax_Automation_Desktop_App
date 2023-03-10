const { until } = require("selenium-webdriver");
const swapToIFrameDefaultContent = require("../../frame-swaps/swapToIFrameDefaultContent");
const {
  navbarHelpSelectors,
} = require("../../../../constants/selectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../../../utils/waits/awaitElementLocatedAndReturn");

const helpNavbarClick = async (driver, subOption) => {
  try {
    await swapToIFrameDefaultContent(driver);

    //Click on help element in navbar
    const helpTabOfNavbar = await awaitElementLocatedAndReturn(
      driver,
      navbarHelpSelectors.tab,
      "xpath"
    );
    await helpTabOfNavbar.click();

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
    await helpNavbarClick(driver, subOption);
  }
};

module.exports = helpNavbarClick;
