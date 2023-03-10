// Library Imports
const { until } = require("selenium-webdriver");
// Functions, Helpers, Utils
const swapToIFrameDefaultContent = require("../../frame-swaps/swapToIFrameDefaultContent");

const awaitElementLocatedAndReturn = require("../../../../utils/waits/awaitElementLocatedAndReturn");
// Selectors
const {
  navbarPaymentsSelectors,
} = require("../../../../constants/selectors/allSelectors");

const paymentsNavbarClick = async (driver, subOption) => {
  try {
    await swapToIFrameDefaultContent(driver);

    //Click on payment element in navbar
    const paymentsTabOfNavbar = await awaitElementLocatedAndReturn(
      driver,
      navbarPaymentsSelectors.tab,
      "xpath"
    );
    await paymentsTabOfNavbar.click();

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
    await paymentsNavbarClick(driver, subOption);
  }
};

module.exports = paymentsNavbarClick;
