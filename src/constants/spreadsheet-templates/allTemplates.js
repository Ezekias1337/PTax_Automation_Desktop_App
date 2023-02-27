import { addNewParcelsTemplate } from "./individual/addNewParcelsTemplate";
import { assessmentNoticesTemplate } from "./individual/assessmentNoticesTemplate";
import { checkAssessorAndCollectorUrlsTemplate } from "./individual/checkAssessorAndCollectorUrlsTemplate";
import { importPropertyValuesTemplate } from "./individual/importPropertyValuesTemplate";
import { parcelQuestChargesTemplate } from "./individual/parcelQuestChargesTemplate";
import { paymentConfirmationsTemplate } from "./individual/paymentConfirmationsTemplate";
import { propertyPointOfContactTemplate } from "./individual/propertyPointOfContactTemplate";
import { propertyTaxBillsTemplate } from "./individual/propertyTaxBillsTemplate";
import { updateParcelNamesTemplate } from "./individual/updateParcelNamesTemplate";

export const spreadsheetTemplates = {
  addNewParcels: addNewParcelsTemplate,
  assessmentNotices: assessmentNoticesTemplate,
  checkAssessorAndCollectorUrls: checkAssessorAndCollectorUrlsTemplate,
  importPropertyValues: importPropertyValuesTemplate,
  parcelQuestCharges: parcelQuestChargesTemplate,
  paymentConfirmations: paymentConfirmationsTemplate,
  propertyPointOfContact: propertyPointOfContactTemplate,
  propertyTaxBills: propertyTaxBillsTemplate,
  updateParcelNames: updateParcelNamesTemplate,
};
