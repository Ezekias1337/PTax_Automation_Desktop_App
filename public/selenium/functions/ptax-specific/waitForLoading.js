// Library Imports
const { until } = require("selenium-webdriver");
// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../utils/waits/awaitElementLocatedAndReturn");

const waitForLoading = async (driver) => {
  const loadingSelectors = {
    loaderHidden: "RadAjaxLoadingPanel1",
    loaderShowing: "RadAjaxLoadingPanel1apAll",
  };

  try {
    const loaderElement = await awaitElementLocatedAndReturn(
      driver,
      loadingSelectors.loaderShowing,
      "id",
      false
    );

    await driver.wait(
      until.stalenessOf(loaderElement),
      60000,
      "Failed to find loader after 60 seconds.",
      5000
    );
  } catch (error) {
    try {
      const hiddenLoaderElement = await awaitElementLocatedAndReturn(
        driver,
        loadingSelectors.loaderHidden,
        "id",
        false
      );
    } catch (error) {}
  }
};

module.exports = waitForLoading;
