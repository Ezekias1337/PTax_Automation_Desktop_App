// Library Imports
const { until, By } = require("selenium-webdriver");
// Functions, Helpers, Utils
const closingAutomationSystem = require("../../../../../functions/driver/closingAutomationSystem");
const loginToPtax = require("../../../../../functions/ptax-specific/loginToPtax");
const saveLinkToFile = require("../../../../../functions/file-operations/saveLinkToFile");
const openNewTab = require("../../../../../functions/tab-swaps-and-handling/openNewTab");
const sendMessageToFrontEnd = require("../../../../../functions/ipc-bus/sendMessage/sendMessageToFrontEnd");

const checkForTaxBillTable = require("../helpers/checkForTaxBillTable");
const checkIfNoResultsOrMultipleResults = require("../helpers/checkIfNoResultsOrMultipleResults");
const checkIfSessionExpired = require("../helpers/checkIfSessionExpired");
const checkIfWebsiteUnderMaintenance = require("../helpers/checkIfWebsiteUnderMaintenance");
const bblSearch = require("../helpers/bblSearch");
const handleGlobalError = require("../../../../../helpers/handleGlobalError");

const awaitElementLocatedAndReturn = require("../../../../../utils/waits/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../../../../utils/strings/generateDynamicXPath");

// Constants
const { nyTaxBillSite } = require("../../../../../constants/urls");
// Selectors
const websiteSelectors = require("../websiteSelectors");

const performDownload = async (
  {
    taxYear,
    downloadDirectory,
    ptaxUsername,
    ptaxPassword,
    spreadsheetContents,
    installmentNumber,
  },
  ipcBusClientNodeMain
) => {
  /* 
      Goes to the NY Tax Bill website,  and downloads the bill 
  */

  const arrayOfSuccessfulOperations = [];
  const arrayOfFailedOperations = [];

  try {
    const taxYearEnd = parseInt(taxYear) + 1;

    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "Logging into Ptax",
      messageColor: "regular",
      errorMessage: null,
    });

    /* 
    
      ! NEED TO REMOVE LOGIN TO PTAX, UNNEEDED
    
    */

    const { driver } = await loginToPtax(
      ptaxUsername,
      ptaxPassword,
      ipcBusClientNodeMain
    );

    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "Navigating to tax website",
      messageColor: "orange",
      errorMessage: null,
    });

    await openNewTab(driver);
    await driver.get(nyTaxBillSite);
    const taxWebsiteWindow = await driver.getWindowHandle();

    const maintenanceStatus = await checkIfWebsiteUnderMaintenance(
      driver,
      ipcBusClientNodeMain
    );
    if (maintenanceStatus === true) {
      await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
        primaryMessage: "Website under maintenance... try again later",
        messageColor: "red",
        errorMessage: null,
      });

      return;
    }

    const agreeBtnElement = await awaitElementLocatedAndReturn(
      driver,
      websiteSelectors.agreeBtn,
      "id"
    );
    await agreeBtnElement.click();
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "Beginning work on first parcel...",
      messageColor: "regular",
      errorMessage: null,
    });

    for (const item of spreadsheetContents) {
      try {
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Current Iteration", {
          primaryMessage: item.ParcelNumber,
          messageColor: null,
          errorMessage: null,
        });
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Working on parcel: ${item.ParcelNumber}`,
          messageColor: "regular",
          errorMessage: null,
        });
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: "Checking if session expired",
          messageColor: "orange",
          errorMessage: null,
        });
        await checkIfSessionExpired(driver, websiteSelectors);

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Searching for parcel: ${item.ParcelNumber}`,
          messageColor: "orange",
          errorMessage: null,
        });
        await bblSearch(driver, item, websiteSelectors);

        const resultsNotPresent = await checkIfNoResultsOrMultipleResults(
          driver,
          item,
          websiteSelectors,
          arrayOfFailedOperations
        );
        if (resultsNotPresent === true) {
          await sendMessageToFrontEnd(
            ipcBusClientNodeMain,
            "Failed Iteration",
            {
              primaryMessage: item,
              messageColor: null,
              errorMessage: `Failed to find parcel: ${item.ParcelNumber} in database.`,
            }
          );
          await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
            primaryMessage: `Failed to find parcel: ${item.ParcelNumber} in database.`,
            messageColor: "red",
            errorMessage: null,
          });

          const bblSearchBtn = await awaitElementLocatedAndReturn(
            driver,
            websiteSelectors.bblSearchBtn,
            "xpath"
          );
          await bblSearchBtn.click();
          await driver.wait(
            until.urlContains("search/commonsearch.aspx?mode=persprop")
          );

          continue;
        }

        /* 
            -----------------------------------------Download the bill--------------------------------
        */

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Navigating to bill for parcel: ${item.ParcelNumber}`,
          messageColor: "orange",
          errorMessage: null,
        });

        const sideMenuTabElement = await awaitElementLocatedAndReturn(
          driver,
          websiteSelectors.sideMenuTab,
          "id"
        );
        const propertyTaxBillsTab = await sideMenuTabElement.findElement(
          By.xpath(websiteSelectors.propertyTaxBillsTab)
        );
        await propertyTaxBillsTab.click();
        await driver.wait(until.urlContains("soa_docs"));
        await driver.sleep(5000);
        /* 
          Before trying to download, need to check for the table element which contains the
          links to ensure the script doesn't get stuck
        */

        const continueExecution = await checkForTaxBillTable(
          driver,
          websiteSelectors
        );

        if (continueExecution === false) {
          await driver.navigate().back();
          await driver.navigate().back();
          await sendMessageToFrontEnd(
            ipcBusClientNodeMain,
            "Failed Iteration",
            {
              primaryMessage: item,
              messageColor: null,
              errorMessage: `Failed for parcel: ${item.ParcelNumber} Parcel found, but no tax bill in database`,
            }
          );
          await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
            primaryMessage: `Failed for parcel: ${item.ParcelNumber} Parcel found, but no tax bill in database`,
            messageColor: "red",
            errorMessage: null,
          });

          continue;
        }

        try {
          await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
            primaryMessage: `Attempting to download tax bill`,
            messageColor: "blue",
            errorMessage: null,
          });

          /* 
              Because of the way the DOM is structured, it's necessary to parse out the correct
              anchor tag this way 
          */
          const downloadLinkChildXPath = generateDynamicXPath(
            "u",
            `Q${installmentNumber}: `,
            "contains"
          );
          const downloadLinkChild = await driver.findElement(
            By.xpath(downloadLinkChildXPath)
          );
          const downloadLink = await downloadLinkChild.findElement(
            By.xpath("./../..")
          );

          const fileNameForFile = `${item.CompanyName} ${item.EntityName} ${item.ParcelNumber}`;

          const downloadSucceeded = await saveLinkToFile(
            downloadLink,
            downloadDirectory,
            fileNameForFile,
            "pdf"
          );

          if (downloadSucceeded === true) {
            await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
              primaryMessage: `Tax bill for parcel: ${item.ParcelNumber} downloaded successfuly`,
              messageColor: "purple",
              errorMessage: null,
            });
          } else {
            await sendMessageToFrontEnd(
              ipcBusClientNodeMain,
              "Failed Iteration",
              {
                primaryMessage: item,
                messageColor: null,
                errorMessage: `Parcel: ${item.ParcelNumber} failed to download`,
              }
            );
            await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
              primaryMessage: `Parcel: ${item.ParcelNumber} failed to download`,
              messageColor: "red",
              errorMessage: null,
            });

            continue;
          }
        } catch (error) {
          await sendMessageToFrontEnd(
            ipcBusClientNodeMain,
            "Failed Iteration",
            {
              primaryMessage: item,
              messageColor: null,
              errorMessage: `Parcel: ${item.ParcelNumber} failed to download`,
            }
          );
          await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
            primaryMessage: `Parcel: ${item.ParcelNumber} failed to download`,
            messageColor: "red",
            errorMessage: null,
          });

          continue;
        }

        const bblSearchBtn = await awaitElementLocatedAndReturn(
          driver,
          websiteSelectors.bblSearchBtn,
          "xpath"
        );
        await bblSearchBtn.click();
        await driver.wait(
          until.urlContains("search/commonsearch.aspx?mode=persprop")
        );

        arrayOfSuccessfulOperations.push(item);
        let itemErrorColRemoved = item;
        if (itemErrorColRemoved?.Error) {
          delete itemErrorColRemoved.Error;
        }
        await sendMessageToFrontEnd(
          ipcBusClientNodeMain,
          "Successful Iteration",
          {
            primaryMessage: itemErrorColRemoved,
            messageColor: null,
            errorMessage: null,
          }
        );
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Succeeded for parcel: ${item.ParcelNumber}`,
          messageColor: "green",
          errorMessage: null,
        });
      } catch (error) {
        /*
          Here I have to add an artificial delay, because if too many parcels fail in quick
          succession, it causes the app to crash
        */
        await driver.sleep(6500);
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Failed Iteration", {
          primaryMessage: item,
          messageColor: null,
          errorMessage: error.message,
        });
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Failed for parcel: ${item.ParcelNumber}`,
          messageColor: "red",
          errorMessage: null,
        });
      }
    }

    await sendMessageToFrontEnd(
      ipcBusClientNodeMain,
      "Automation Completed",
      {}
    );
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "The automation is complete.",
      messageColor: "regular",
      errorMessage: null,
    });

    await closingAutomationSystem(driver, ipcBusClientNodeMain);
  } catch (error) {
    await handleGlobalError(ipcBusClientNodeMain, error.message);
  }
};

module.exports = performDownload;
