// Functions, Helpers, and Utils
const waitForLoading = require("../../../functions/ptax-specific/waitForLoading");

const awaitElementLocatedAndReturn = require("../../../utils/waits/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../../utils/strings/generateDynamicXPath");
const scrollElementIntoView = require("../../../utils/web-elements/scrollElementIntoView");
const clickOnSelectOption = require("../../../utils/web-elements/clickOnSelectOption");
// Selectors
const {
  propertyPointOfContactSelectors,
} = require("../../../constants/selectors/allSelectors");

const updatePointOfContactInfo = async (driver, item) => {
  const clientPocSelect = await awaitElementLocatedAndReturn(
    driver,
    propertyPointOfContactSelectors.clientPocSelect,
    "id"
  );
  const clientPocXpath = generateDynamicXPath(
    "option",
    item.ClientPointOfContact,
    "contains"
  );
  await scrollElementIntoView(driver, clientPocSelect);
  await clickOnSelectOption(driver, clientPocSelect, clientPocXpath);

  const clientProducingOfficeSelect = await awaitElementLocatedAndReturn(
    driver,
    propertyPointOfContactSelectors.clientProducingOfficeSelect,
    "id"
  );
  const clientProducingOfficeXpath = generateDynamicXPath(
    "option",
    item.ClientProducingOffice,
    "contains"
  );
  await scrollElementIntoView(driver, clientProducingOfficeSelect);
  await clickOnSelectOption(
    driver,
    clientProducingOfficeSelect,
    clientProducingOfficeXpath
  );

  const clientProducerSelect = await awaitElementLocatedAndReturn(
    driver,
    propertyPointOfContactSelectors.clientProducerSelect,
    "id"
  );
  const clientProducerXpath = generateDynamicXPath(
    "option",
    item.ClientProducer,
    "contains"
  );
  await scrollElementIntoView(driver, clientProducerSelect);
  await clickOnSelectOption(driver, clientProducerSelect, clientProducerXpath);

  const saveButton = await awaitElementLocatedAndReturn(
    driver,
    propertyPointOfContactSelectors.saveButton,
    "id"
  );
  await scrollElementIntoView(driver, saveButton);
  await saveButton.click();
  await waitForLoading(driver);
};

module.exports = updatePointOfContactInfo;
