/* 
  I wanted to place this in a shared folder at the root directory,
  but because of the way react compiles files, you cant import files
  from outside the src directory.
  
  
  Because of this, the automationList.js file exists in two 
  locations:
  
    1.) src/constants/automation-list/automationList.js
    2.) selenium/constants/automation-list/automationList.js

  The only differences between the two is that:
  
    a.) The version living in the selenium folder includes functions in the 
         object representing different automations
    b.) The version in the src folder is exported as an array.
*/

const addNewParcelsData = require("./individual/addNewParcelsData");
const assessmentNoticesData = require("./individual/assessmentNoticesData");
const checkAssessorAndCollectorUrlsData = require("./individual/checkAssessorAndCollectorUrlsData");
const importPropertyValuesData = require("./individual/importPropertyValuesData");
const parcelQuestChargesData = require("./individual/parcelQuestChargesData");
const paymentConfirmationsData = require("./individual/paymentConfirmationsData");
const propertyPointOfContactData = require("./individual/propertyPointOfContactData");
const propertyTaxBillsData = require("./individual/propertyTaxBillsData");
const updateParcelNamesData = require("./individual/updateParcelNamesData");

const automationList = {
  addNewParcels: addNewParcelsData,
  assessmentNotices: assessmentNoticesData,
  checkAssessorAndCollectorUrls: checkAssessorAndCollectorUrlsData,
  importPropertyValues: importPropertyValuesData,
  parcelQuestCharges: parcelQuestChargesData,
  paymentConfirmations: paymentConfirmationsData,
  propertyPointOfContact: propertyPointOfContactData,
  propertyTaxBills: propertyTaxBillsData,
  updateParcelNames: updateParcelNamesData,
};

module.exports = automationList;
