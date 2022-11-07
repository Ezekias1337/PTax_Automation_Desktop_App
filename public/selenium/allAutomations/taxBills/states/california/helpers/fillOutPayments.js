const waitForLoading = require("../../../../../functions/pTaxSpecific/waitForLoading/waitForLoading");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");
const sendKeysPTaxInputFields = require("../../../../../functions/pTaxSpecific/sendKeysPTaxInputFields/sendKeysPTaxInputFields");
const deleteInputFieldContents = require("../../../../../functions/general/deleteInputFieldContents");
const scrollElementIntoView = require("../../../../../functions/general/scrollElementIntoView");

const fillOutPayments = async (
  driver,
  selectors,
  installmentTotalString,
  installmentNumber
) => {
  if (installmentNumber === "1") {
    const generatePaymentsBtn = await awaitElementLocatedAndReturn(
      driver,
      selectors.generatePayments,
      "id"
    );
    await scrollElementIntoView(driver, generatePaymentsBtn);
    await generatePaymentsBtn.click();
    await waitForLoading(driver);

    const finalPayment1 = await awaitElementLocatedAndReturn(
      driver,
      selectors.finalPayment1,
      "id"
    );
    await sendKeysPTaxInputFields(finalPayment1, installmentTotalString, false);

    const basePayment1 = await awaitElementLocatedAndReturn(
      driver,
      selectors.basePayment1,
      "id"
    );
    await sendKeysPTaxInputFields(basePayment1, installmentTotalString, false);

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

    const btnSaveAllPayment = await awaitElementLocatedAndReturn(
      driver,
      selectors.saveAll,
      "id"
    );
    await scrollElementIntoView(driver, btnSaveAllPayment);
    await btnSaveAllPayment.click();

    await waitForLoading();
  } else if (installmentNumber === "2") {
    /* 
      Fill out final and base payment for payment 2
    */

    const finalPayment2 = await awaitElementLocatedAndReturn(
      driver,
      selectors.finalPayment2,
      "id"
    );
    await sendKeysPTaxInputFields(finalPayment2, installmentTotalString, false);

    const basePayment2 = await awaitElementLocatedAndReturn(
      driver,
      selectors.basePayment2,
      "id"
    );
    await sendKeysPTaxInputFields(basePayment2, installmentTotalString, false);

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
  }
};

module.exports = fillOutPayments;
