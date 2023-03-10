// Functions, Helpers, Utils
const appealsNavbarClick = require("./individual/appealsNavbarClick");
const documentsNavbarClick = require("./individual/documentsNavbarClick");
const editNavbarClick = require("./individual/editNavbarClick");
const fileNavbarClick = require("./individual/fileNavbarClick");
const helpNavbarClick = require("./individual/helpNavbarClick");
const linksNavbarClick = require("./individual/linksNavbarClick");
const paymentsNavbarClick = require("./individual/paymentsNavbarClick");
const reportsNavbarClick = require("./individual/reportsNavbarClick");
const viewNavbarClick = require("./individual/viewNavbarClick");

const clickNavbarMenu = async (driver, section, subOption) => {
  try {
    switch (section) {
      case "file":
        await fileNavbarClick(driver, subOption);
        break;
      case "edit":
        await editNavbarClick(driver, subOption);
        break;
      case "view":
        await viewNavbarClick(driver, subOption);
        break;
      case "documents":
        await documentsNavbarClick(driver, subOption);
        break;
      case "appeals":
        await appealsNavbarClick(driver, subOption);
        break;
      case "payments":
        await paymentsNavbarClick(driver, subOption);
        break;
      case "reports":
        await reportsNavbarClick(driver, subOption);
        break;
      case "links":
        await linksNavbarClick(driver, subOption);
        break;
      case "help":
        await helpNavbarClick(driver, subOption);
        break;
      default:
        console.log("No match found for navbar section");
    }
  } catch (error) {
    await clickNavbarMenu(driver, section, subOption);
  }
};

module.exports = clickNavbarMenu;
