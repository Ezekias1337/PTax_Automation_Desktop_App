// Functions, Helpers, Utils
const waitForLoading = require("../../../../../functions/ptax-specific/waitForLoading");

const awaitElementLocatedAndReturn = require("../../../../../utils/waits/awaitElementLocatedAndReturn");
const sendKeysInputFields = require("../../../../../utils/web-elements/sendKeysInputFields");
const scrollElementIntoView = require("../../../../../utils/web-elements/scrollElementIntoView");

const fillOutPayments = async (
  driver,
  selectors,
  installmentStringOne,
  installmentStringTwo,
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
    await sendKeysInputFields(finalPayment1, installmentStringOne, false);

    const basePayment1 = await awaitElementLocatedAndReturn(
      driver,
      selectors.basePayment1,
      "id"
    );
    await sendKeysInputFields(basePayment1, installmentStringOne, false);

    const finalPayment2 = await awaitElementLocatedAndReturn(
      driver,
      selectors.finalPayment2,
      "id"
    );
    await sendKeysInputFields(finalPayment2, installmentStringTwo, false);

    const basePayment2 = await awaitElementLocatedAndReturn(
      driver,
      selectors.basePayment2,
      "id"
    );
    await sendKeysInputFields(basePayment2, installmentStringTwo, false);

    const btnSaveAllPayment = await awaitElementLocatedAndReturn(
      driver,
      selectors.saveAll,
      "id"
    );
    await scrollElementIntoView(driver, btnSaveAllPayment);
    await btnSaveAllPayment.click();

    await waitForLoading();
  } else if (installmentNumber === "2") {
    const finalPayment2 = await awaitElementLocatedAndReturn(
      driver,
      selectors.finalPayment2,
      "id"
    );
    await sendKeysInputFields(finalPayment2, installmentStringTwo, false);

    const basePayment2 = await awaitElementLocatedAndReturn(
      driver,
      selectors.basePayment2,
      "id"
    );
    await sendKeysInputFields(basePayment2, installmentStringTwo, false);

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
