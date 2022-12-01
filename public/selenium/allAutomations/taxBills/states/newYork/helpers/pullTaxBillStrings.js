const { until, By } = require("selenium-webdriver");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");
const removeSpecialCharsFromString = require("../../../../../utils/strings/removeSpecialCharsFromString");

/* 
  Installment 1 uses the account balance tab,
  Installment 2 uses the account history tab
*/

const pullTaxBillStrings = async (
  driver,
  taxWebsiteSelectors,
  installmentNumber,
  taxYearEnd
) => {
  if (installmentNumber === "1") {
    const sideMenuTabElement = await awaitElementLocatedAndReturn(
      driver,
      taxWebsiteSelectors.accountBalanceTab,
      "xpath"
    );

    await sideMenuTabElement.click();
    await driver.wait(until.urlContains("account_balance"));

    const tableWithTaxBillData = await awaitElementLocatedAndReturn(
      driver,
      taxWebsiteSelectors.taxBillInformation,
      "id"
    );

    const assessmentTableArrayOfRows = await tableWithTaxBillData.findElements(
      By.css("tr")
    );

    /* 
      Need to pick the correct row based off the installment number
    */

    let rowWithInstallmentInformation;

    for (const row of assessmentTableArrayOfRows) {
      const arrayOfRowChildren = await row.findElements(By.css("td"));
      const cellWithInstallmentString = arrayOfRowChildren[1];
      const stringToCheck = await cellWithInstallmentString.getAttribute(
        "innerText"
      );

      if (installmentNumber === stringToCheck) {
        rowWithInstallmentInformation = row;
        break;
      }
    }

    const installmentRowTDs = await rowWithInstallmentInformation.findElements(
      By.css("td")
    );
    const tdWithTotal = installmentRowTDs[9];
    const installmentTotalTD = await tdWithTotal.getAttribute("innerText");
    const installmentTotalString = installmentTotalTD.replace(/,/g, "");
    const installmentTotalInt = parseFloat(installmentTotalString);

    const objToReturn = {
      installmentTotalString,
      installmentTotalInt,
    };

    return objToReturn;
  } else if (installmentNumber === "2") {
  } else if (installmentNumber === "3") {
    const sideMenuTabElement = await awaitElementLocatedAndReturn(
      driver,
      taxWebsiteSelectors.accountHistoryTab,
      "xpath"
    );

    await sideMenuTabElement.click();
    await driver.wait(until.urlContains("acc_hist"));

    const tableWithTaxBillData = await awaitElementLocatedAndReturn(
      driver,
      taxWebsiteSelectors.accountHistorySummary,
      "id"
    );
    const tableArrayOfRows = await tableWithTaxBillData.findElements(
      By.css("tr")
    );
    /* 
      Get all rows with the matching taxYearEnd and Charge Type of TAX
    */
    const arrayOfRows = [];

    for (const row of tableArrayOfRows) {
      if (arrayOfRows?.length === 4) {
        break;
      }

      const arrayOfRowChildren = await row.findElements(By.css("td"));
      const cellWithYearString = arrayOfRowChildren[0];
      const stringToCheckYear = await cellWithYearString.getAttribute(
        "innerText"
      );
      const cellWithChargeTypeString = arrayOfRowChildren[2];
      const stringToCheckChargeType =
        await cellWithChargeTypeString.getAttribute("innerText");

      if (
        stringToCheckYear === taxYearEnd.toString() &&
        stringToCheckChargeType === "TAX"
      ) {
        arrayOfRows.push(row);
      }
    }

    /* 
      Now that we have all the rows, get the 3rd and 4th installment data
      for the payment section, and also combine all installments to update
      the total amount owed in the liability section 
    */
    let totalOwed = 0;
    let installmentThreeString,
      installmentFourString = "";

    for (const row of arrayOfRows) {
      const arrayOfRowChildren = await row.findElements(By.css("td"));
      const cellWithInstallmentNumber = arrayOfRowChildren[1];
      const cellWithChargeAmount = arrayOfRowChildren[5];

      const installmentNumber = await cellWithInstallmentNumber.getAttribute(
        "innerText"
      );
      const chargeAmount = await cellWithChargeAmount.getAttribute("innerText");

      if (installmentNumber === "3") {
        installmentThreeString = removeSpecialCharsFromString(chargeAmount);
      } else if (installmentNumber === "4") {
        installmentFourString = removeSpecialCharsFromString(chargeAmount);
      }
      const chargeAmountToInteger = parseFloat(
        removeSpecialCharsFromString(chargeAmount)
      );
      totalOwed += chargeAmountToInteger;
    }

    totalOwed = Math.round((totalOwed + Number.EPSILON) * 100) / 100;

    const objToReturn = {
      installmentThreeString,
      installmentFourString,
      totalOwed,
    };

    return objToReturn;
  } else if (installmentNumber === "4") {
  }
};

module.exports = pullTaxBillStrings;
