const addNewParcelsColumns = require("./individual/addNewParcelsColumns");
const downloadTaxBillsColumns = require("./individual/downloadTaxBillsColumns");
const dataEntryTaxBillsColumns = require("./individual/dataEntryTaxbillsColumns");
const checkWebsiteURLsColumns = require("./individual/checkWebsiteURLsColumns");
const downloadAndDataEntryAssessmentNoticesColumns = require("./individual/downloadAndDataEntryAssessmentNoticesColumns");
const renameParcelsColumns = require("./individual/renameParcelsColumns");


const allSpreadSheetColumns = {
  addNewParcelsColumns: addNewParcelsColumns,
  downloadTaxBillsColumns: downloadTaxBillsColumns,
  dataEntryTaxBillsColumns: dataEntryTaxBillsColumns,
  checkWebsiteURLsColumns: checkWebsiteURLsColumns,
  downloadAndDataEntryAssessmentNoticesColumns: downloadAndDataEntryAssessmentNoticesColumns,
  renameParcelsColumns: renameParcelsColumns
};

module.exports = allSpreadSheetColumns;
