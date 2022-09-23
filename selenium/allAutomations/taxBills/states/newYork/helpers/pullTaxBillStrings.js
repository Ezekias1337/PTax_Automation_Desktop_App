const { until, By } = require("selenium-webdriver");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");

const pullTaxBillStrings = async (
  driver,
  taxWebsiteSelectors,
  installmentNumber
) => {
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
  console.log([installmentTotalString, installmentTotalInt]);

  return [installmentTotalString, installmentTotalInt];
};

module.exports = pullTaxBillStrings;
