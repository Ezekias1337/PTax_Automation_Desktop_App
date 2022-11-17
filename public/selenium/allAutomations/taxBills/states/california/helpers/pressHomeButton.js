const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");
const websiteSelectors = require("../websiteSelectors");

const pressHomeButton = async (driver) => {
  const homeButton = await awaitElementLocatedAndReturn(
    driver,
    websiteSelectors.homeButton,
    "css"
  );
  await homeButton.click();
};

module.exports = pressHomeButton;
