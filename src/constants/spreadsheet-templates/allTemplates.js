import { addNewParcelsTemplate } from "./individual/addNewParcelsTemplate";
import { assessmentNoticesTemplate } from "./individual/assessmentNoticesTemplate";
import { checkAssessorAndCollectorUrlsTemplate } from "./individual/checkAssessorAndCollectorUrlsTemplate";
import { paymentConfirmationsTemplate } from "./individual/paymentConfirmationsTemplate";
import { propertyPointOfContactTemplate } from "./individual/propertyPointOfContactTemplate";
import { propertyTaxBillsTemplate } from "./individual/propertyTaxBillsTemplate";
import { updateParcelNamesTemplate } from "./individual/updateParcelNamesTemplate";

export const spreadsheetTemplates = {
  addNewParcels: addNewParcelsTemplate,
  assessmentNotices: assessmentNoticesTemplate,
  checkAssessorAndCollectorUrls: checkAssessorAndCollectorUrlsTemplate,
  paymentConfirmations: paymentConfirmationsTemplate,
  propertyPointOfContact: propertyPointOfContactTemplate,
  propertyTaxBills: propertyTaxBillsTemplate,
  updateParcelNames: updateParcelNamesTemplate,
};
