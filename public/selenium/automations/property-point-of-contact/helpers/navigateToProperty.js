// Functions, Helpers, and Utils
const swapToIFrameDefaultContent = require("../../../functions/ptax-specific/frame-swaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../../functions/ptax-specific/frame-swaps/swapToIFrame0");
const swapToIFrame1 = require("../../../functions/ptax-specific/frame-swaps/swapToIFrame1");

const sendKeysInputFields = require("../../../utils/web-elements/sendKeysInputFields");
const awaitElementLocatedAndReturn = require("../../../utils/waits/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../../utils/strings/generateDynamicXPath");
// Selectors
const {
  searchByLocationSelector,
  propertyPointOfContactSelectors,
} = require("../../../constants/selectors/allSelectors");

const navigateToProperty = async (driver, item) => {
  await swapToIFrameDefaultContent(driver);
  const searchByLocationInput = await awaitElementLocatedAndReturn(
    driver,
    searchByLocationSelector,
    "id"
  );
  await sendKeysInputFields(searchByLocationInput, item.Property, true);
  await swapToIFrame0(driver);

  const propertySideBarXPath = generateDynamicXPath(
    "a",
    item.Property,
    "contains"
  );
  const propertyToUpdate = await awaitElementLocatedAndReturn(
    driver,
    propertySideBarXPath,
    "xpath"
  );
  await propertyToUpdate.click();
  await driver.sleep(2500);

  await swapToIFrame1(driver);
  const editPropertyButton = await awaitElementLocatedAndReturn(
    driver,
    propertyPointOfContactSelectors.editPropertyButton,
    "xpath"
  );
  await editPropertyButton.click();
};

module.exports = navigateToProperty;
