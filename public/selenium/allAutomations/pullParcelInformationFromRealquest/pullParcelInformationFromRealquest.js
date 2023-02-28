// Library Imports
const colors = require("colors");
// Functions, Helpers, Utils
const buildDriver = require("../../functions/driver/buildDriver");

const pullParcelInformationFromRealquest = async () => {
  /* 
        Need to pick automation by using sublocation
    */

  const driver = await buildDriver();
  console.log(`Running pull information from Realquest automation:`);
};

module.exports = pullParcelInformationFromRealquest;
