const buildDriver = require("../../functions/driver/buildDriver");
const colors = require('colors');

const pullParcelInformationFromRealquest = async () => {
  /* 
        Need to pick automation by using sublocation
    */

  const driver = await buildDriver();
  console.log(`Running pull information from Realquest automation:`);
};

module.exports = pullParcelInformationFromRealquest;
