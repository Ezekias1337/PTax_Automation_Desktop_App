/* 
  This file contains all of the selectors for traversing through the DOM
  of Ptax
*/

const addNewAssessmentSelector = require("./individual/addNewAssessmentSelector");
const checkBoxSelector = require("./individual/checkBoxSelector");
const editDetailsSelector = require("./individual/editDetailsSelector");
const expandNavBarSelector = require("./individual/expandNavBarSelector");
const searchByAddressSelector = require("./individual/searchByAddressSelector");
const searchByLocationSelector = require("./individual/searchByLocationSelector");
const searchByParcelNumberSelector = require("./individual/searchByParcelNumberSelector");
const searchByParcelOwnerSelector = require("./individual/searchByParcelOwnerSelector");
const newParcelHeader = require("./individual/newParcelHeader");
const reserveDocument = require("./individual/reserveDocument");
const uploadDocument = require("./individual/uploadDocument");
const taxBillDrivenTabSelector = require("./individual/taxBillDrivenTabSelector");
const navbarAppealsSelectors = require("./navbar-dropdowns/navbar-appeals/navbarAppealsSelectors");
const navbarDocumentsSelectors = require("./navbar-dropdowns/navbar-documents/navbarDocumentsSelectors");
const navbarEditSelectors = require("./navbar-dropdowns/navbar-edit/navbarEditSelectors");
const navbarFileSelectors = require("./navbar-dropdowns/navbar-file/navbarFileSelectors");
const navbarHelpSelectors = require("./navbar-dropdowns/navbar-help/navbarHelpSelectors");
const navbarLinksSelectors = require("./navbar-dropdowns/navbar-links/navbarLinksSelectors");
const navbarPaymentsSelectors = require("./navbar-dropdowns/navbar-payments/navbarPaymentsSelectors");
const navbarReportsSelectors = require("./navbar-dropdowns/navbar-reports/navbarReportsSelectors");
const navbarViewSelectors = require("./navbar-dropdowns/navbar-view/navbarViewSelectors");
const addNewParcelsSelectors = require("./add-new-parcels-selectors/addNewParcelsSelectors");
const assessmentNoticesSelectors = require("./assessment-notices-selectors/assessmentNoticesSelectors");
const checkAssessorAndCollectorUrlsSelectors = require("./check-assessor-and-collector-urls-selectors/checkAssessorAndCollectorUrlsSelectors")
const propertyPointOfContactSelectors = require("./property-point-of-contact-selectors/propertyPointOfContactSelectors");
const taxBillSelectors = require("./tax-bill-selectors/taxBillSelectors");
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
  checkAssessorAndCollectorUrlsSelectors,
  propertyPointOfContactSelectors,
  taxBillSelectors,
};

module.exports = allSelectors;
