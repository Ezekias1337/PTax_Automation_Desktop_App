const { until } = require("selenium-webdriver");
const swapToIFrameDefaultContent = require("../../frame-swaps/swapToIFrameDefaultContent");
const {
  navbarDocumentsSelectors,
} = require("../../../../constants/selectors/allSelectors");
const awaitElementLocatedAndReturn = require("../../../../utils/waits/awaitElementLocatedAndReturn");

const documentsNavbarClick = async (driver, subOption) => {
  try {
    await swapToIFrameDefaultContent(driver);

    //Click on edit element in navbar
    const documentTabOfNavbar = await awaitElementLocatedAndReturn(
      driver,
      navbarDocumentsSelectors.tab,
      "xpath"
    );
    await documentTabOfNavbar.click();

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
    await documentsNavbarClick(driver, subOption);
  }
};

module.exports = documentsNavbarClick;
