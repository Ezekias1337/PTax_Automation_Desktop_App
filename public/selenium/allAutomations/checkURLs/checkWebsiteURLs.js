// Library Imports
const colors = require("colors");
const { By, until } = require("selenium-webdriver");
// Functions, Helpers, Utils
const buildDriver = require("../../functions/driver/buildDriver");
const readSpreadsheetFile = require("../../functions/fileOperations/readSpreadsheetFile");
const verifySpreadSheetColumnNames = require("../../functions/fileOperations/verifySpreadSheetColumnNames");
const handleColumnNameLogging = require("../../functions/fileOperations/handleColumnNameLogging");
const printAutomationReportToSheet = require("../../functions/fileOperations/printAutomationReportToSheet");
const consoleLogLine = require("../../functions/general/consoleLogLine");
const closingAutomationSystem = require("../../functions/general/closingAutomationSystem");

const {
  checkWebsiteURLsColumns,
} = require("../../dataValidation/spreadsheetColumns/allSpreadSheetColumns");

const checkURLSelectors = {
  deadLink: "body.neterror",
  pageMoved: "//*[contains(text(), 'Not Found')]",
  fourOFour: "//*[contains(text(), '404')]",
};
const arrayOfSuccessfulOperations = [];
const arrayOfFailedOperations = [];

const checkForDeadLink = async (driver, item) => {
  try {
    await driver.wait(
      until.elementLocated(By.css(checkURLSelectors.deadLink)),
      5000
    );
    arrayOfFailedOperations.push(item);
    console.log(colors.red.bold(`${item.WebSite} is a dead link!`));
  } catch (error) {
    console.log(colors.green.bold(`${item.WebSite} is not a dead link!`));
  }
};

const checkForPageMoved = async (driver, item) => {
  try {
    const pageMovedElement = await driver.findElement(
      By.xpath(checkURLSelectors.pageMoved)
    );

    arrayOfFailedOperations.push(item);
    console.log(
      colors.yellow.bold(
        `${item.WebSite} has moved it's page, but the link isn't dead`
      )
    );
  } catch (error) {
    console.log(
      colors.green.bold(`${item.WebSite} no page moved warning found!`)
    );
  }

  try {
    const fourOFourElement = await driver.findElement(
      By.xpath(checkURLSelectors.fourOFour)
    );

    //Check if this collector already exists in array, if so don't push it
    if (!arrayOfFailedOperations.includes(item)) {
      arrayOfFailedOperations.push(item);

      console.log(
        colors.yellow.bold(`${item.WebSite} 404 error, but the link isn't dead`)
      );
    }
  } catch (error) {
    arrayOfSuccessfulOperations.push(item);
    console.log(colors.green.bold(`${item.WebSite} no 404 error found!`));
  }
};

const checkWebsiteURLs = async () => {
  let driver;

  try {
    const dataFromSpreadsheet = await readSpreadsheetFile();
    const [areCorrectSheetColumnsPresent, arrayOfMissingColumnNames] =
      verifySpreadSheetColumnNames(
        checkWebsiteURLsColumns,
        dataFromSpreadsheet[0]
      );

    await handleColumnNameLogging(
      areCorrectSheetColumnsPresent,
      arrayOfMissingColumnNames
    );
    if (areCorrectSheetColumnsPresent === false) {
      return;
    }

    driver = await buildDriver();
    console.log(`Running check Assessor URL automation: `);

    for (const item of dataFromSpreadsheet) {
      try {
        consoleLogLine();
        console.log(`Working on: ${item.AssessorOrCollectorName}`);

        if (item?.WebSite === "NULL") {
          arrayOfFailedOperations.push(item);
          console.log(colors.red.bold("URL is blank"));
        } else {
          // Selenium will error if the URL doesn't have http or https included
          if (
            !(
              item?.WebSite.includes("http://") ||
              item?.WebSite.includes("https://")
            )
          ) {
            const urlWithHTTPAppended = `http://${item.WebSite}`;
            await driver.get(urlWithHTTPAppended);
          } else {
            await driver.get(item.WebSite);
          }

          await checkForDeadLink(driver, item);
          await checkForPageMoved(driver, item);
        }
      } catch (error) {
        //console.log(error);

        if (!arrayOfFailedOperations.includes(item)) {
          arrayOfFailedOperations.push(item);
          console.log(colors.red.bold(`${item.WebSite} is a dead link!`));
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  await printAutomationReportToSheet(
    arrayOfSuccessfulOperations,
    arrayOfFailedOperations,
    "./output/"
  );

  console.log(
    colors.blue.bold(
      `Reports have been generated for URLs that were added successful and unsuccessfuly, located in the output folder. Please check the 'Failed Operations' tab to verify if any results need manual review.`
    )
  );
  await closingAutomationSystem(driver);
};

module.exports = checkWebsiteURLs;
