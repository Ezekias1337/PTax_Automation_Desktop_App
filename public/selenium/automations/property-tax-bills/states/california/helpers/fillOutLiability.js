// Functions, Helpers, Utils
const waitForLoading = require("../../../../../functions/ptax-specific/waitForLoading");

const awaitElementLocatedAndReturn = require("../../../../../utils/waits/awaitElementLocatedAndReturn");
const sendKeysInputFields = require("../../../../../utils/web-elements/sendKeysInputFields");
const selectDropdownElement = require("../../../../../utils/web-elements/selectDropdownElement");
const scrollElementIntoView = require("../../../../../utils/web-elements/scrollElementIntoView");

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
  await sendKeysInputFields(navTaxInput, navTaxesDue, false);

  const totalAmountLiabilityInput = await awaitElementLocatedAndReturn(
    driver,
    selectors.totalAmountLiability,
    "id"
  );
  await sendKeysInputFields(totalAmountLiabilityInput, totalTaxesDue, false);

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
