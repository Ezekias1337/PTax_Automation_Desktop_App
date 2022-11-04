const colors = require("colors");
const performDataEntry = require("./performOperations/performDataEntry");
const performDataEntryAndDownload = require("./performOperations/performDataEntryAndDownload");
const performDownload = require("./performOperations/performDownload");

const taxWebsiteSelectors = {
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
  taxBillTable: "datalet_div_1",
  bblSearchBtn: "//span[contains(text(), 'BBL Search')]",
  taxBillInformation: "Account Balance Details"
};

const newYorkTaxBills = async (state, sublocation, operation) => {
  /* 
    Need to pick automation by using sublocation
  */

  console.log(
    colors.bold.red(
      "Warning: ensure the data in the Parcel Number column all follow the convention: "
    ),
    "\n",
    "Burough-Block-Lot",
    "\n",
    "Example: 1-482-1302"
  );

  switch (operation) {
    case "Data Entry":
      await performDataEntry(state, sublocation, operation, taxWebsiteSelectors);
      return;
    case "Download Files":
      await performDownload(state, sublocation, operation, taxWebsiteSelectors);
      break;
    case "Data Entry, Download, & Upload Document":
      await performDataEntryAndDownload(state, sublocation, operation, taxWebsiteSelectors);
      return;
    default:
      console.log("No operation found, check spelling of operation");
      return;
  }
};

module.exports = newYorkTaxBills;
