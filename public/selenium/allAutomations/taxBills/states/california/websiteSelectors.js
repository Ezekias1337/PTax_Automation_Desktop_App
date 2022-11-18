const websiteSelectors = {
  userNameInput: "txtName",
  passwordInput: "txtPwd",

  countyInputField: "#QuickSearch_CountyId",
  parcelInputField: "#QuickSearch_ApnId",
  parcelQuestSearchButton: "#Quick > button.btnQuickSearch",
  parcelQuestViewResultsButton: "#resultsView > button",
  noResultsWarning:
    "//span[contains(text(), 'Total found was 0. Please revise your search criteria.')]",

  assessorDataTab:
    "#gridDetails > div.detail-properties > div > ul > li.assessor-data.noprint",
  docsAndSalesHistoryTab:
    "#gridDetails > div.detail-properties > div > ul > li.transhist-data.noprint",
  taxBillDataTab:
    "#gridDetails > div.detail-properties > div > ul > li.tax-data.noprint",
  financeTab:
    "#gridDetails > div.detail-properties > div > ul > li.finance-data.noprint",

  taxYear: "div.baseInfo > div.firstLineText.left.boldColor > span",
  taxDetailsWrapper: "div.taxDetails",
  taxDetailsBreakdown: "div.taxDetails > table.taxDetailTable",
  totalTaxesDue: "td.totalTax",
  installmentInfoWrapper: "div.taxPaymentDiv > table",
  installmentOneInfo:
    "div.taxPaymentDiv > table > tbody > tr:nth-child(1) > td",
  installmentTwoInfo:
    "div.taxPaymentDiv > table > tbody > tr:nth-child(2) > td",
  billType: "//span[contains(text(), 'Regular')]",

  screenShotSelector: "body",

  loader:
    "#searchResults > div > div.resultsPanel > div.resultsProgress > div > div",
  loadingBar: "#searchResults > div > div.resultsPanel > div.resultsProgress",
  taxSummaryDiv: "//div[contains(text(), 'Tax Summary')]",
  homeButton: "#applicationHost li.navHome",
};

module.exports = websiteSelectors;
