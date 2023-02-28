// Library Imports
const { By } = require("selenium-webdriver");
// Functions, Helpers, Utils
const waitForLoading = require("../../../../../functions/pTaxSpecific/waitForLoading/waitForLoading");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");
const sendKeysPTaxInputFields = require("../../../../../functions/pTaxSpecific/sendKeysPTaxInputFields/sendKeysPTaxInputFields");
const scrollElementIntoView = require("../../../../../functions/general/scrollElementIntoView");

const fillOutLiability = async (
  driver,
  selectors,
  taxBillObj,
  installmentNumber
) => {
  try {
    if (installmentNumber === "1" || installmentNumber === "2") {
      const totalAmountLiabilityInput = await awaitElementLocatedAndReturn(
        driver,
        selectors.totalAmountLiability,
        "id"
      );
      await sendKeysPTaxInputFields(
        totalAmountLiabilityInput,
        taxBillObj.installmentTotalString,
        false
      );

      const saveLiabilityBtn = await awaitElementLocatedAndReturn(
        driver,
        selectors.saveLiability,
        "id"
      );
      await scrollElementIntoView(driver, saveLiabilityBtn);
      await saveLiabilityBtn.click();
      await waitForLoading(driver);
    } /* else if (installmentNumber === "3" || installmentNumber === "4") {
      const totalAmountLiabilityInput = await awaitElementLocatedAndReturn(
        driver,
        selectors.totalAmountLiability,
        "id"
      );
      await sendKeysPTaxInputFields(
        totalAmountLiabilityInput,
        taxBillObj.totalOwed,
        false
      );

      const saveLiabilityBtn = await awaitElementLocatedAndReturn(
        driver,
        selectors.saveLiability,
        "id"
      );
      await scrollElementIntoView(driver, saveLiabilityBtn);
      await saveLiabilityBtn.click();
      await waitForLoading(driver);
    }  */

    /* 
      Using the default collector determine if the parcel should have
      2 or 4 installments
    */

    const collectorDropdownEle = await awaitElementLocatedAndReturn(
      driver,
      selectors.collector,
      "id"
    );
    const arrayOfOptionElements = await collectorDropdownEle.findElements(
      By.css("option")
    );
    let selectedOption;

    for (const item of arrayOfOptionElements) {
      const isSelected = await item.isSelected();
      if (isSelected === true) {
        selectedOption = item;
        break;
      }
    }

    const selectedOptionText = await selectedOption.getAttribute("innerText");
    if (selectedOptionText.includes("2")) {
      return 2;
    } else if (selectedOptionText.includes("4")) {
      return 4;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = fillOutLiability;
