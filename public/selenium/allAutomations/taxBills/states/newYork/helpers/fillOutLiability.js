const { By } = require("selenium-webdriver");
const waitForLoading = require("../../../../../functions/pTaxSpecific/waitForLoading/waitForLoading");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");
const sendKeysPTaxInputFields = require("../../../../../functions/pTaxSpecific/sendKeysPTaxInputFields/sendKeysPTaxInputFields");

const fillOutLiability = async (
  driver,
  selectors,
  installmentTotalString,
  installmentNumber
) => {
  // ! NEED TO ADD SUPPORT FOR OTHER INSTALLMENT #S OTHER THAN 1
  
  if (installmentNumber === "1") {
    const totalAmountLiabilityInput = await awaitElementLocatedAndReturn(
      driver,
      selectors.totalAmountLiability,
      "id"
    );
    await sendKeysPTaxInputFields(
      totalAmountLiabilityInput,
      installmentTotalString,
      false
    );

    const saveLiabilityBtn = await awaitElementLocatedAndReturn(
      driver,
      selectors.saveLiability,
      "id"
    );
    await saveLiabilityBtn.click();
    await waitForLoading(driver);
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
};

module.exports = fillOutLiability;
