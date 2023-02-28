// Functions, Helpers, Utils
const waitForLoading = require("../../../../../functions/pTaxSpecific/waitForLoading/waitForLoading");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");
const sendKeysPTaxInputFields = require("../../../../../functions/pTaxSpecific/sendKeysPTaxInputFields/sendKeysPTaxInputFields");
const deleteInputFieldContents = require("../../../../../functions/general/deleteInputFieldContents");
const scrollElementIntoView = require("../../../../../functions/general/scrollElementIntoView");

const removeSpecialCharsFromString = require("../../../../../utils/strings/removeSpecialCharsFromString");

const fillOutPayments = async (
  driver,
  selectors,
  taxBillObj,
  installmentNumber,
  twoOrFourInstallments = 4
) => {
  if (installmentNumber === "1") {
    const generatePaymentsBtn = await awaitElementLocatedAndReturn(
      driver,
      selectors.generatePayments,
      "id"
    );
    await generatePaymentsBtn.click();
    await waitForLoading(driver);

    const finalPayment1 = await awaitElementLocatedAndReturn(
      driver,
      selectors.finalPayment1,
      "id"
    );
    await sendKeysPTaxInputFields(
      finalPayment1,
      taxBillObj.installmentTotalString,
      false
    );

    const basePayment1 = await awaitElementLocatedAndReturn(
      driver,
      selectors.basePayment1,
      "id"
    );
    await sendKeysPTaxInputFields(
      basePayment1,
      taxBillObj.installmentTotalString,
      false
    );

    // For the first installment, must delete the input of final/base payment for all other installments

    const finalPayment2 = await awaitElementLocatedAndReturn(
      driver,
      selectors.finalPayment2,
      "id"
    );
    await deleteInputFieldContents(finalPayment2);

    const basePayment2 = await awaitElementLocatedAndReturn(
      driver,
      selectors.basePayment2,
      "id"
    );
    await deleteInputFieldContents(basePayment2);

    if (twoOrFourInstallments === 4) {
      const finalPayment3 = await awaitElementLocatedAndReturn(
        driver,
        selectors.finalPayment3,
        "id"
      );
      await deleteInputFieldContents(finalPayment3);

      const basePayment3 = await awaitElementLocatedAndReturn(
        driver,
        selectors.basePayment3,
        "id"
      );
      await deleteInputFieldContents(basePayment3);

      const finalPayment4 = await awaitElementLocatedAndReturn(
        driver,
        selectors.finalPayment4,
        "id"
      );
      await deleteInputFieldContents(finalPayment4);

      const basePayment4 = await awaitElementLocatedAndReturn(
        driver,
        selectors.basePayment4,
        "id"
      );
      await deleteInputFieldContents(basePayment4);
    }

    const btnSaveAllPayment = await awaitElementLocatedAndReturn(
      driver,
      selectors.saveAll,
      "id"
    );
    await btnSaveAllPayment.click();
    await waitForLoading();
  } else if (installmentNumber === "2") {
    /* 
      Get the current total liability
    */

    let totalLiability = await awaitElementLocatedAndReturn(
      driver,
      selectors.totalAmountLiability,
      "id"
    );
    const totalLiabilityStringUnparsed = await totalLiability.getAttribute(
      "value"
    );
    const totalLiabilityStringParsed = removeSpecialCharsFromString(
      totalLiabilityStringUnparsed
    );

    /* const finalPayment1Number = parseFloat(finalPayment1StringParsed); */
    const totalLiabilityNumber = parseFloat(totalLiabilityStringParsed);
    const installmentTotalStringToNumber = parseFloat(
      taxBillObj.installmentTotalString
    );

    /* 
      Add the amount from payment 1 to the Final liability
    */

    const newTotalLiabilityNumber =
      totalLiabilityNumber + installmentTotalStringToNumber;
    const newTotalLiabilityString = newTotalLiabilityNumber.toString();

    /* 
      Replace the final liability with this new total
      (have to regrab the input field to prevent element staleness error)
    */

    totalLiability = await awaitElementLocatedAndReturn(
      driver,
      selectors.totalAmountLiability,
      "id"
    );
    console.log("newTotalLiabilityString: ", newTotalLiabilityString);
    await deleteInputFieldContents(totalLiability);
    await sendKeysPTaxInputFields(
      totalLiability,
      newTotalLiabilityString,
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

    /* 
      Fill out final and base payment for payment 2
    */

    const finalPayment2 = await awaitElementLocatedAndReturn(
      driver,
      selectors.finalPayment2,
      "id"
    );
    await sendKeysPTaxInputFields(
      finalPayment2,
      taxBillObj.installmentTotalString,
      false
    );

    const basePayment2 = await awaitElementLocatedAndReturn(
      driver,
      selectors.basePayment2,
      "id"
    );
    await sendKeysPTaxInputFields(
      basePayment2,
      taxBillObj.installmentTotalString,
      false
    );

    /* 
      Save
    */
    const btnSaveAllPayment = await awaitElementLocatedAndReturn(
      driver,
      selectors.saveAll,
      "id"
    );
    await scrollElementIntoView(driver, btnSaveAllPayment);
    await btnSaveAllPayment.click();
    await waitForLoading();
  } else if (installmentNumber === "3" || installmentNumber === "4") {
    const finalPayment3 = await awaitElementLocatedAndReturn(
      driver,
      selectors.finalPayment3,
      "id"
    );
    await sendKeysPTaxInputFields(
      finalPayment3,
      taxBillObj.installmentThreeString,
      false
    );

    const basePayment3 = await awaitElementLocatedAndReturn(
      driver,
      selectors.basePayment3,
      "id"
    );
    await sendKeysPTaxInputFields(
      basePayment3,
      taxBillObj.installmentThreeString,
      false
    );

    const finalPayment4 = await awaitElementLocatedAndReturn(
      driver,
      selectors.finalPayment4,
      "id"
    );
    await sendKeysPTaxInputFields(
      finalPayment4,
      taxBillObj.installmentFourString,
      false
    );

    const basePayment4 = await awaitElementLocatedAndReturn(
      driver,
      selectors.basePayment4,
      "id"
    );
    await sendKeysPTaxInputFields(
      basePayment4,
      taxBillObj.installmentFourString,
      false
    );

    const btnSaveAllPayment = await awaitElementLocatedAndReturn(
      driver,
      selectors.saveAll,
      "id"
    );
    await scrollElementIntoView(driver, btnSaveAllPayment);
    await btnSaveAllPayment.click();
    await waitForLoading();
  }
};

module.exports = fillOutPayments;
