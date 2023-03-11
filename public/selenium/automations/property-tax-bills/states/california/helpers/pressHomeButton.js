// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../../../utils/waits/awaitElementLocatedAndReturn");
// Selectors
const websiteSelectors = require("../websiteSelectors");

const pressHomeButton = async (driver) => {
  try {
    const homeButton = await awaitElementLocatedAndReturn(
      driver,
      websiteSelectors.homeButton,
      "css"
    );
    await homeButton.click();
  } catch (error) {}
};

module.exports = pressHomeButton;
