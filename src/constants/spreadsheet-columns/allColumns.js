import { addNewParcelsColumns } from "./individual/addNewParcelsColumns";
import { assessmentNoticesColumns } from "./individual/assessmentNoticesColumns";
import { paymentConfirmationsColumns } from "./individual/paymentConfirmationsColumns";
import { propertyTaxBillsColumns } from "./individual/propertyTaxBillsColumns";

export const spreadsheetColumns = {
  addNewParcels: addNewParcelsColumns,
  assessmentNotices: assessmentNoticesColumns,
  paymentConfirmations: paymentConfirmationsColumns,
  propertyTaxBills: propertyTaxBillsColumns,
};
