const buildDriver = require("../../functions/driver/buildDriver");
const colors = require('colors');

const propertyPointOfContact = async (sublocation) => {
    /* 
        Need to pick automation by using sublocation
    */

    const driver = await buildDriver();
    console.log(`Running change property point of contact automation for: ${sublocation}`);
};

module.exports = propertyPointOfContact;
