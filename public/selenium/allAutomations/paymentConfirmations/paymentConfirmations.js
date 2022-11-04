const buildDriver = require("../../functions/driver/buildDriver");
const colors = require('colors');

const paymentConfirmations = async (sublocation) => {
    /* 
        Need to pick automation by using sublocation
    */

    const driver = await buildDriver();
    console.log(`Running payment confirmations automation for: ${sublocation}`);
};

module.exports = paymentConfirmations;
