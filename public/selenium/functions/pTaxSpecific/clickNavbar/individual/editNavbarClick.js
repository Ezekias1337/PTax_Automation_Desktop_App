const { until } = require("selenium-webdriver");
const swapToIFrameDefaultContent = require("../../frameSwaps/swapToIFrameDefaultContent");
const {
  navbarEditSelectors,
} = require("../../../../ptaxXpathsAndSelectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../../general/awaitElementLocatedAndReturn");

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
    console.log(error, error.message);
  }
};

module.exports = editNavbarClick;
