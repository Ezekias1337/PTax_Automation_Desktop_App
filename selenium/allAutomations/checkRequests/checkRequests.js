const buildDriver = require("../../functions/driver/buildDriver");
const colors = require('colors');

const checkRequests = async (sublocation) => {
    /* 
        Need to pick automation by using sublocation
    */

    const driver = await buildDriver();
    console.log(`Running check request automation for: ${sublocation}`);
};

module.exports = checkRequests;
