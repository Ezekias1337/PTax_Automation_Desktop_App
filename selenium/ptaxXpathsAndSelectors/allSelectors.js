const addNewAssessmentSelector = require("./individual/addNewAssessmentSelector");
const checkBoxSelector = require("./individual/checkBoxSelector");
const editDetailsSelector = require("./individual/editDetailsSelector");
const expandNavBarSelector = require("./individual/expandNavBarSelector")
const searchByAddressSelector = require("./individual/searchByAddressSelector");
const searchByLocationSelector = require("./individual/searchByLocationSelector");
const searchByParcelNumberSelector = require("./individual/searchByParcelNumberSelector");
const searchByParcelOwnerSelector = require("./individual/searchByParcelOwnerSelector");
const newParcelHeader = require("./individual/newParcelHeader");
const reserveDocument = require("./individual/reserveDocument");
const uploadDocument = require("./individual/uploadDocument");
const taxBillDrivenTabSelector = require("./individual/taxBillDrivenTabSelector");
const navbarAppealsSelectors = require("./navbarDropdowns/navbarAppeals/navbarAppealsSelectors");
const navbarDocumentsSelectors = require("./navbarDropdowns/navbarDocuments/navbarDocumentsSelectors");
const navbarEditSelectors = require("./navbarDropdowns/navbarEdit/navbarEditSelectors");
const navbarFileSelectors = require("./navbarDropdowns/navbarFile/navbarFileSelectors");
const navbarHelpSelectors = require("./navbarDropdowns/navbarHelp/navbarHelpSelectors");
const navbarLinksSelectors = require("./navbarDropdowns/navbarLinks/navbarLinksSelectors");
const navbarPaymentsSelectors = require("./navbarDropdowns/navbarPayments/navbarPaymentsSelectors");
const navbarReportsSelectors = require("./navbarDropdowns/navbarReports/navbarReportsSelectors");
const navbarViewSelectors = require("./navbarDropdowns/navbarView/navbarViewSelectors");
const addNewParcelsSelectors = require("./addNewParcelsSelectors/addNewParcelsSelectors");
const assessmentNoticesSelectors = require("./assessmentNoticesSelectors/assessmentNoticesSelectors");
const taxBillSelectors = require("./taxBillSelectors/taxBillSelectors");
const {
  userNameSelector,
  passWordSelector,
} = require("./individual/loginPageSelectors");

const allSelectors = {
  addNewAssessmentSelector,
  checkBoxSelector,
  editDetailsSelector,
  expandNavBarSelector,
  userNameSelector,
  passWordSelector,
  searchByAddressSelector,
  searchByLocationSelector,
  searchByParcelNumberSelector,
  searchByParcelOwnerSelector,
  newParcelHeader,
  reserveDocument,
  uploadDocument,
  taxBillDrivenTabSelector,
  navbarAppealsSelectors,
  navbarDocumentsSelectors,
  navbarEditSelectors,
  navbarFileSelectors,
  navbarHelpSelectors,
  navbarLinksSelectors,
  navbarPaymentsSelectors,
  navbarReportsSelectors,
  navbarViewSelectors,
  addNewParcelsSelectors,
  assessmentNoticesSelectors,
  taxBillSelectors
};

module.exports = allSelectors;
