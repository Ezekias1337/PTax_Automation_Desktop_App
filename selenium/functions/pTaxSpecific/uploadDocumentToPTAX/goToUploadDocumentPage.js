const swapToIFrame1 = require("../../pTaxSpecific/frameSwaps/swapToIFrame1");
const {
  navbarDocumentsSelectors,
} = require("../../../ptaxXpathsAndSelectors/allSelectors");
const clickNavbarMenu = require("../../pTaxSpecific/clickNavbar/clickNavbarMenu");

const goToUploadDocumentPage = async (driver) => {
  await clickNavbarMenu(
    driver,
    "documents",
    navbarDocumentsSelectors.newScannedDocument
  );
  await swapToIFrame1(driver);
};

module.exports = goToUploadDocumentPage;
