const websiteSelectors = {
  agreeBtn: "btAgree",
  burough1:
    "/html/body/div/div[3]/section/div/form/table/tbody/tr/td/div/div/table[1]/tbody/tr[6]/td/table/tbody/tr[1]/td[2]/select/option[2]",
  burough2:
    "/html/body/div/div[3]/section/div/form/table/tbody/tr/td/div/div/table[1]/tbody/tr[6]/td/table/tbody/tr[1]/td[2]/select/option[3]",
  burough3:
    "/html/body/div/div[3]/section/div/form/table/tbody/tr/td/div/div/table[1]/tbody/tr[6]/td/table/tbody/tr[1]/td[2]/select/option[4]",
  burough4:
    "/html/body/div/div[3]/section/div/form/table/tbody/tr/td/div/div/table[1]/tbody/tr[6]/td/table/tbody/tr[1]/td[2]/select/option[5]",
  burough5:
    "/html/body/div/div[3]/section/div/form/table/tbody/tr/td/div/div/table[1]/tbody/tr[6]/td/table/tbody/tr[1]/td[2]/select/option[6]",
  blockInputField: "inpTag",
  lotInputField: "inpStat",
  searchButton: "btSearch",
  noParcelResultsFoundWarner:
    "//p[contains(text(), 'Your search did not find any records.')]",
  websiteMaintenanceWarner: `//b[contains(text(), 'We are currently conducting maintenance')]`,
  sideMenuTab: "sidemenu",
  propertyTaxBillsTab: `//span[contains(text(), 'Property Tax Bills')]`,
  accountBalanceTab: `//span[contains(text(), 'Account Balance')]`,
  accountHistoryTab: `//span[contains(text(), 'Account History')]`,
  taxBillTable: "datalet_div_1",
  bblSearchBtn: "//span[contains(text(), 'BBL Search')]",
  taxBillInformation: "Account Balance Details",
  accountHistorySummary: "Account History Summary",
};

module.exports = websiteSelectors;
