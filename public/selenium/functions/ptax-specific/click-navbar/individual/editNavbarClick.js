const { until } = require("selenium-webdriver");
const swapToIFrameDefaultContent = require("../../frame-swaps/swapToIFrameDefaultContent");
const {
  navbarEditSelectors,
} = require("../../../../constants/selectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../../../utils/waits/awaitElementLocatedAndReturn");

const editNavbarClick = async (driver, subOption) => {
  try {
    await swapToIFrameDefaultContent(driver);

    //Click on edit element in navbar
    const editTabOfNavbar = await awaitElementLocatedAndReturn(
      driver,
      navbarEditSelectors.tab,
      "xpath"
    );
    await editTabOfNavbar.click();

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
    await editNavbarClick(driver, subOption);
  }
};

module.exports = editNavbarClick;
