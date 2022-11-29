const { Key, until, By } = require("selenium-webdriver");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");
const fluentWait = require("../../../../../functions/general/fluentWait");
const removeSpecialCharsFromString = require("../../../../../utils/strings/removeSpecialCharsFromString");

/* 
    Different counties calculate their taxes different.
    
    LA: NAVs = total tax - general tax
    Riverside: NAVs pulled from special assessments section
    etc.
*/

const pullTaxBillStrings = async (driver, taxYear, county, selectors) => {
  try {
    /* 
      First verify the server returned the tax data, once in a blue
      moon it just returns empty with no warning
    */

    const isTaxDataPresent = await fluentWait(
      driver,
      selectors.totalTaxesDue,
      "css"
    );
    console.log("isTaxDataPresent: ", isTaxDataPresent);

    if (isTaxDataPresent === false) {
      return {};
    }

    /* 
        First verify that the tax year is correct. Sometimes parcel
        quest doesnt have them all up to date. If it doesnt match
        the correct year, return an empty obj
    */
    const taxYearElement = await awaitElementLocatedAndReturn(
      driver,
      selectors.taxYear,
      "css"
    );
    const taxYearInnerText = await taxYearElement.getAttribute("innerText");
    if (taxYear !== taxYearInnerText) {
      return {};
    }

    /* 
        Second verify that the Bill Type is "Regular", if not
        return an empty obj, uses a fluent wait to ensure script
        doesn't get stuck on the xpath selector
    */

    const billTypeIsRegular = await fluentWait(
      driver,
      selectors.billType,
      "xpath",
      10,
      2
    );
    if (billTypeIsRegular === true) {
      const billTypeElement = await awaitElementLocatedAndReturn(
        driver,
        selectors.billType,
        "xpath"
      );
      const billTypeText = await billTypeElement.getAttribute("innerText");
      if (billTypeText !== "Regular") {
        return {};
      }
    } else {
      return {};
    }

    /* 
        Now that the tax year and bill type has been confirmed, get the 
        general tax
    */
    const taxDetailsBreakdownTable = await awaitElementLocatedAndReturn(
      driver,
      selectors.taxDetailsBreakdown,
      "css"
    );

    /* 
        Parse through the table to find the tr element for General tax
    */
    const taxDetailsBody = await taxDetailsBreakdownTable.findElement(
      By.css("tbody")
    );
    const arrayOfTaxDetailsTRs = await taxDetailsBody.findElements(
      By.css("tr")
    );

    let rowWithGeneralTax;
    for (const tableRow of arrayOfTaxDetailsTRs) {
      const arrayOfTableRowTDs = await tableRow.findElements(By.css("td"));
      const tdToCheckForStringMatch = arrayOfTableRowTDs[0];
      const tdSpanElement = await tdToCheckForStringMatch.findElement(
        By.css("span")
      );
      const tdSpanElementInnerText = await tdSpanElement.getAttribute(
        "innerText"
      );

      if (tdSpanElementInnerText === "GENERAL TAX") {
        rowWithGeneralTax = tableRow;
        break;
      }
    }

    /* 
        Now that the tr with the general tax has been found,
        extract the total owed.
    */

    const arrayOfGeneralTaxTDs = await rowWithGeneralTax.findElements(
      By.css("td")
    );
    const tdWithTotalGeneralTax = arrayOfGeneralTaxTDs[3];
    const spanWithTotalGeneralTax = await tdWithTotalGeneralTax.findElement(
      By.css("span")
    );
    const generalTaxDuePreParse = await spanWithTotalGeneralTax.getAttribute(
      "innerText"
    );
    const generalTaxDue = removeSpecialCharsFromString(generalTaxDuePreParse);

    /* 
        Get the Total Taxes Due
    */

    const totalTaxesDueWrapper = await awaitElementLocatedAndReturn(
      driver,
      selectors.totalTaxesDue,
      "css"
    );
    const totalTaxesDueSpan = await totalTaxesDueWrapper.findElement(
      By.css("span")
    );
    const totalTaxesDuePreParse = await totalTaxesDueSpan.getAttribute(
      "innerText"
    );
    const totalTaxesDue = removeSpecialCharsFromString(totalTaxesDuePreParse);

    /* 
        Get the amount owed and due date for installment 1
    */

    const installmentOneElement = await awaitElementLocatedAndReturn(
      driver,
      selectors.installmentOneInfo,
      "css"
    );
    const arrayOfInstallmentOneSpans = await installmentOneElement.findElements(
      By.css("span")
    );

    const installmentOneAmountDueElement = arrayOfInstallmentOneSpans[0];
    const installmentOneDueDateElement = arrayOfInstallmentOneSpans[1];

    const installmentOneAmountDuePreParse =
      await installmentOneAmountDueElement.getAttribute("innerText");
    const installmentOneAmountDue = removeSpecialCharsFromString(
      installmentOneAmountDuePreParse
    );

    const installmentOneDueDatePreParse =
      await installmentOneDueDateElement.getAttribute("innerText");
    const installmentOneDueDate = removeSpecialCharsFromString(
      installmentOneDueDatePreParse
    );
    /* 
        Get the amount owed and due date for installment 2
    */

    const installmentTwoElement = await awaitElementLocatedAndReturn(
      driver,
      selectors.installmentTwoInfo,
      "css"
    );
    const arrayOfInstallmentTwoSpans = await installmentTwoElement.findElements(
      By.css("span")
    );

    const installmentTwoAmountDueElement = arrayOfInstallmentTwoSpans[0];
    const installmentTwoDueDateElement = arrayOfInstallmentTwoSpans[1];

    const installmentTwoAmountDuePreParse =
      await installmentTwoAmountDueElement.getAttribute("innerText");
    const installmentTwoAmountDue = removeSpecialCharsFromString(
      installmentTwoAmountDuePreParse
    );

    const installmentTwoDueDatePreParse =
      await installmentTwoDueDateElement.getAttribute("innerText");
    const installmentTwoDueDate = removeSpecialCharsFromString(
      installmentTwoDueDatePreParse
    );

    /* 
        Get the NAVs for LA by: totalTaxesDue - generalTaxDue
    */

    let totalNAVs = "";
    if (county === "Los Angeles") {
      const totalTaxesDueToInteger = parseFloat(totalTaxesDue);
      const generalTaxDueToInteger = parseFloat(generalTaxDue);

      const totalNAVsInteger = totalTaxesDueToInteger - generalTaxDueToInteger;
      totalNAVs = totalNAVsInteger.toString();
    }

    let taxBillStringsObj = {
      generalTaxDue: generalTaxDue,
      totalTaxesDue: totalTaxesDue,
      totalNAVs: totalNAVs,
      installmentOneAmountDue: installmentOneAmountDue,
      installmentOneDueDate: installmentOneDueDate,
      installmentTwoAmountDue: installmentTwoAmountDue,
      installmentTwoDueDate: installmentTwoDueDate,
    };

    return taxBillStringsObj;
  } catch (error) {
    return {};
  }
};

module.exports = pullTaxBillStrings;
