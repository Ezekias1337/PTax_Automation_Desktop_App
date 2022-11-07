const { By } = require("selenium-webdriver");
const waitForLoading = require("../../../../../functions/pTaxSpecific/waitForLoading/waitForLoading");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");
const sendKeysPTaxInputFields = require("../../../../../functions/pTaxSpecific/sendKeysPTaxInputFields/sendKeysPTaxInputFields");
const generateDynamicXPath = require("../../../../../functions/general/generateDynamicXPath");
const selectDropdownElement = require("../../../../../utils/web-elements/selectDropdownElement");
const scrollElementIntoView = require("../../../../../functions/general/scrollElementIntoView");

const fillOutLiability = async (
  driver,
  selectors,
  totalTaxesDue,
  navTaxesDue
) => {
  /* 
    Enter the NAVs and Total Liabilities,
    Then change the Data Source to Parcel Quest,
    Then Save
  */

  const navTaxInput = await awaitElementLocatedAndReturn(
    driver,
    selectors.navTax,
    "id"
  );
  await sendKeysPTaxInputFields(navTaxInput, navTaxesDue, false);

  const totalAmountLiabilityInput = await awaitElementLocatedAndReturn(
    driver,
    selectors.totalAmountLiability,
    "id"
  );
  await sendKeysPTaxInputFields(
    totalAmountLiabilityInput,
    totalTaxesDue,
    false
  );

  await selectDropdownElement(
    driver,
    selectors.dataSourceLiability,
    "ParcelQuest",
    true,
    selectors.dataSourceLiabilityParcelQuest
  );

  const saveLiabilityBtn = await awaitElementLocatedAndReturn(
    driver,
    selectors.saveLiability,
    "id"
  );
  await scrollElementIntoView(driver, saveLiabilityBtn);
  await saveLiabilityBtn.click();
  await waitForLoading(driver);
};

module.exports = fillOutLiability;
