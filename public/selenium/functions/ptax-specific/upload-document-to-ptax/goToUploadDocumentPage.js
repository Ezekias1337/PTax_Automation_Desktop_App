const swapToIFrame1 = require("../frame-swaps/swapToIFrame1");
const {
  navbarDocumentsSelectors,
} = require("../../../constants/selectors/allSelectors");
const clickNavbarMenu = require("../click-navbar/clickNavbarMenu");

const goToUploadDocumentPage = async (driver) => {
  await clickNavbarMenu(
    driver,
    "documents",
    navbarDocumentsSelectors.newScannedDocument
  );
  await swapToIFrame1(driver);
};

module.exports = goToUploadDocumentPage;
