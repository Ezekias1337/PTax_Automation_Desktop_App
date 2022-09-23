const newYorkTaxBills = require("./states/newYork/newYorkTaxBills");

const taxBills = async (state, city, operation) => {
  /* 
        Need to pick automation by using sublocation
    */

  switch (state) {
    case "California":
      // code block
      break;
    case "New York":
      await newYorkTaxBills(state, city, operation);
      break;
    default:
    // code block
  }
};

module.exports = taxBills;
