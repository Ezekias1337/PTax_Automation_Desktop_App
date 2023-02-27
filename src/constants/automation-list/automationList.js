/* 
  I wanted to place this in a shared folder at the root directory,
  but because of the way react compiles files, you cant import files
  from outside the src directory.
  
  
  Because of this, the automationList.js file exists in two 
  locations:
  
    1.) src/constants/automationList.js
    2.) selenium/allAutomations/automationList/automationList.js

  The only differences between the two is that:
  
    a.) The version living in the
        selenium folder includes functions in the object representing different
        automations
    b.) The version in the src folder is exported as an array.
*/

import { addNewParcelsData } from "./individual/addNewParcelsData";
import { assessmentNoticesData } from "./individual/assessmentNoticesData";
import { checkAssessorAndCollectorUrlsData } from "./individual/checkAssessorAndCollectorUrlsData";
import { importPropertyValuesData } from "./individual/importPropertyValuesData";
import { parcelQuestChargesData } from "./individual/parcelQuestChargesData";
import { paymentConfirmationsData } from "./individual/paymentConfirmationsData";
import { propertyPointOfContactData } from "./individual/propertyPointOfContactData";
import { propertyTaxBillsData } from "./individual/propertyTaxBillsData";
import { updateParcelNamesData } from "./individual/updateParcelNamesData";

export const automationList = {
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

const automationListArray = [];

for (const item of Object.entries(automationList)) {
  automationListArray.push(item[1]);
}

export const automationListArrayExport = automationListArray;
