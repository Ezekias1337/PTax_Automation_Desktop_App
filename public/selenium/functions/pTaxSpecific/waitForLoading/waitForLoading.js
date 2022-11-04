const colors = require("colors");
const { until, By } = require("selenium-webdriver");
const awaitElementLocatedAndReturn = require("../../../functions/general/awaitElementLocatedAndReturn");

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
