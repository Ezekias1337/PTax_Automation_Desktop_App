const { By } = require("selenium-webdriver");
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
    // ! NEED TO ADD SUPPORT FOR INSTALLMENTS #S 2/4

    if (installmentNumber === "1") {
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
    } else if (installmentNumber === "2") {
    } else if (installmentNumber === "3") {
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
    } else if (installmentNumber === "4") {
    }

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
