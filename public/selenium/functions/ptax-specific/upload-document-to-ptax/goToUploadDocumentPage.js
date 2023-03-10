// Functions, Helpers, Utils
const swapToIFrame1 = require("../frame-swaps/swapToIFrame1");
const clickNavbarMenu = require("../click-navbar/clickNavbarMenu");
// Selectors
const {
  navbarDocumentsSelectors,
} = require("../../../constants/selectors/allSelectors");

const goToUploadDocumentPage = async (driver) => {
  await clickNavbarMenu(
    driver,
    "documents",
    navbarDocumentsSelectors.newScannedDocument
  );
  await swapToIFrame1(driver);
};

module.exports = goToUploadDocumentPage;
