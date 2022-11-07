const californiaTaxBills = require("./states/california/californiaTaxBills");
const newYorkTaxBills = require("./states/newYork/newYorkTaxBills");

const taxBills = async (automationConfigObject, ipcBusClientNodeMain) => {
  /* 
        Need to pick automation by using sublocation
    */

  switch (automationConfigObject.state) {
    case "California":
      await californiaTaxBills(automationConfigObject, ipcBusClientNodeMain);
      break;
    case "New York":
      await newYorkTaxBills(automationConfigObject, ipcBusClientNodeMain);
      break;
    default:
      break;
  }
};

module.exports = taxBills;
