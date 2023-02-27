import { addNewParcelsColumns } from "./individual/addNewParcelsColumns";
import { assessmentNoticesColumns } from "./individual/assessmentNoticesColumns";
import { checkAssessorAndCollectorUrlsColumns } from "./individual/checkAssessorAndCollectorUrlsColumns";
import { importPropertyValuesColumns } from "./individual/importPropertyValuesColumns";
import { parcelQuestChargesColumns } from "./individual/parcelQuestChargesColumns";
import { paymentConfirmationsColumns } from "./individual/paymentConfirmationsColumns";
import { propertyPointOfContactColumns } from "./individual/propertyPointOfContactColumns";
import { propertyTaxBillsColumns } from "./individual/propertyTaxBillsColumns";
import { updateParcelNamesColumns } from "./individual/updateParcelNamesColumns";

export const spreadsheetColumns = {
  addNewParcels: addNewParcelsColumns,
  assessmentNotices: assessmentNoticesColumns,
  checkAssessorAndCollectorUrls: checkAssessorAndCollectorUrlsColumns,
  importPropertyValues: importPropertyValuesColumns,
  parcelQuestCharges: parcelQuestChargesColumns,
  paymentConfirmations: paymentConfirmationsColumns,
  propertyPointOfContact: propertyPointOfContactColumns,
  propertyTaxBills: propertyTaxBillsColumns,
  updateParcelNames: updateParcelNamesColumns,
};
