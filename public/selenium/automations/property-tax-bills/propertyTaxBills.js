const californiaTaxBills = require("./states/california/californiaTaxBills");
const newYorkTaxBills = require("./states/newYork/newYorkTaxBills");

const propertyTaxBills = async (automationConfigObject, ipcBusClientNodeMain) => {
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

module.exports = propertyTaxBills;
