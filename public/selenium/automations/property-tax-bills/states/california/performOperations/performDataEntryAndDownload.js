// Library Imports
const { until, By } = require("selenium-webdriver");
// Functions, Helpers, Utils
const logErrorMessageCatch = require("../../../../../functions/general/logErrorMessageCatch");
const closingAutomationSystem = require("../../../../../functions/driver/closingAutomationSystem");
const loginToPTAX = require("../../../../../functions/ptax-specific/loginToPTAX");
const swapToIFrameDefaultContent = require("../../../../../functions/ptax-specific/frame-swaps/swapToIFrameDefaultContent");
const swapToIFrame0 = require("../../../../../functions/ptax-specific/frame-swaps/swapToIFrame0");
const swapToIFrame1 = require("../../../../../functions/ptax-specific/frame-swaps/swapToIFrame1");
const clickCheckMyPropertiesCheckBox = require("../../../../../functions/ptax-specific/clickCheckMyPropertiesCheckBox");
const openNewTab = require("../../../../../functions/tab-swaps-and-handling/openNewTab");
const switchToPTaxTab = require("../../../../../functions/tab-swaps-and-handling/switchToPTaxTab");
const switchToTaxWebsiteTab = require("../../../../../functions/tab-swaps-and-handling/switchToTaxWebsiteTab");
const navigateToExistingAssessment = require("../../../../../functions/ptax-specific/navigateToExistingAssessment");
const printPageToPDF = require("../../../../../functions/file-operations/printPageToPDF");
const waitForLoading = require("../../../../../functions/ptax-specific/waitForLoading");
const sendMessageToFrontEnd = require("../../../../../functions/ipc-bus/sendMessage/sendMessageToFrontEnd");
const handleAutomationCancel = require("../../../../../functions/ipc-bus/handleAutomationCancel");

const uploadTaxBill = require("../../../cross-state-helpers/uploadTaxBill");
const searchForParcel = require("../helpers/searchForParcel");
const pullTaxBillStrings = require("../helpers/pullTaxBillStrings");
const fillOutLiability = require("../helpers/fillOutLiability");
const fillOutPayments = require("../helpers/fillOutPayments");
const pressHomeButton = require("../helpers/pressHomeButton");
const loginToParcelQuest = require("../helpers/loginToParcelQuest");

const awaitElementLocatedAndReturn = require("../../../../../utils/waits/awaitElementLocatedAndReturn");
const generateDynamicXPath = require("../../../../../utils/strings/generateDynamicXPath");
const sendKeysInputFields = require("../../../../../utils/web-elements/sendKeysInputFields");
const fluentWait = require("../../../../../utils/waits/fluentWait");
const scrollElementIntoView = require("../../../../../utils/web-elements/scrollElementIntoView");
const selectDropdownElement = require("../../../../../utils/web-elements/selectDropdownElement");
const {
  replaceSpacesWithUnderscore,
} = require("../../../../../../shared/utils/strings/replaceSpacesWithUnderscore");
const checkIfObjectIsEmpty = require("../../../../../../shared/utils/objects/checkIfObjectIsEmpty");
// Constants
const {
  parcelQuestLoginPage,
  parcelQuestHomePage,
} = require("../../../../../constants/urls");
// Selectors
const {
  searchByParcelNumberSelector,
  taxBillSelectors,
} = require("../../../../../constants/selectors/allSelectors");
const websiteSelectors = require("../websiteSelectors");

const performDataEntryAndDownload = async (
  {
    taxYear,
    downloadDirectory,
    ptaxUsername,
    ptaxPassword,
    parcelQuestUsername,
    parcelQuestPassword,
    spreadsheetContents,
    county,
    installmentNumber,
  },
  ipcBusClientNodeMain
) => {
  const arrayOfSuccessfulOperations = [];
  const arrayOfFailedOperations = [];

  try {
    const taxYearEnd = parseInt(taxYear) + 1;

    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "Logging in to Ptax",
      messageColor: "regular",
      errorMessage: null,
    });
    const [ptaxWindow, driver] = await loginToPTAX(ptaxUsername, ptaxPassword);
    handleAutomationCancel(ipcBusClientNodeMain, driver);

    /* 
        These values will be null if the login failed, this will cause the execution
        to stop. If it fails before even loading ptax, it means
        that the chrome web driver is out of date. Otherwise,
        it means the login credentials are incorrect 
    */

    if (ptaxWindow === null || driver === null) {
      await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
        primaryMessage:
          "Login to PTax failed! Please check your username and password.",
        messageColor: "red",
        errorMessage: null,
      });
      return;
    }
    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "Login into Ptax Successful!",
      messageColor: "regular",
      errorMessage: null,
    });

    await swapToIFrame0(driver);
    await clickCheckMyPropertiesCheckBox(driver);

    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "Logging into Parcel Quest",
      messageColor: "regular",
      errorMessage: null,
    });

    await openNewTab(driver);
    await driver.get(parcelQuestLoginPage);
    await driver.wait(until.urlIs(parcelQuestLoginPage));
    const taxWebsiteWindow = await driver.getWindowHandle();

    const loginToParcelQuestSuccessful = await loginToParcelQuest(
      driver,
      parcelQuestUsername,
      parcelQuestPassword,
      websiteSelectors,
      parcelQuestLoginPage,
      parcelQuestHomePage
    );

    /* 
        if loginToParcelQuestSuccessful is false,
        it means the login credentials are invalid,
        or the selectors are no longer valid
    */
    if (loginToParcelQuestSuccessful === false) {
      await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
        primaryMessage:
          "Login to Parcel Quest failed! Please check your username and password.",
        messageColor: "red",
        errorMessage: null,
      });

      return;
    }

    await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
      primaryMessage: "Login into Parcel Quest Successful!",
      messageColor: "regular",
      errorMessage: null,
    });

    for (const item of spreadsheetContents) {
      try {
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Working on Parcel Number: ${item.ParcelNumber}`,
          messageColor: "regular",
          errorMessage: null,
        });
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Current Iteration", {
          primaryMessage: item.ParcelNumber,
          messageColor: null,
          errorMessage: null,
        });

        /* 
          Reset the browser tabs for new iteration
        */
        const currentUrl = await driver.getCurrentUrl();
        if (currentUrl !== parcelQuestHomePage) {
          await driver.sleep(5000);
          await driver.get(parcelQuestLoginPage);
          await loginToParcelQuest(
            driver,
            parcelQuestUsername,
            parcelQuestPassword,
            websiteSelectors,
            parcelQuestHomePage
          );
        }

        /* 
          Proceed with iteration
        */
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Searching for: ${item.ParcelNumber}`,
          messageColor: "orange",
          errorMessage: null,
        });

        const searchSuccessful = await searchForParcel(
          driver,
          item.ParcelNumber,
          county,
          websiteSelectors,
          "up"
        );
        if (searchSuccessful === false) {
          arrayOfFailedOperations.push(item);

          await switchToTaxWebsiteTab(taxWebsiteWindow);

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

          continue;
        }

        /* 
          Navigate to the bill
          
          For some reason parcel quest has tons of duplicate elements which share a selector, but
          are not visible in the DOM. To get to the Tax Bill Data, we must select the 2nd element
          returned from the array.
        */
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Navigating to bill for: ${item.ParcelNumber}`,
          messageColor: "orange",
          errorMessage: null,
        });

        await driver.sleep(6000);
        const arrayOfPossibleTaxBillDataTabElements = await driver.findElements(
          By.css(websiteSelectors.taxBillDataTab)
        );
        const taxBillDataTabElement = arrayOfPossibleTaxBillDataTabElements[1];
        await taxBillDataTabElement.click();
        await driver.sleep(2000);

        /* 
          Now verify that parcelquest yielded results by getting the pagination element,
          if the innertext === -1, no data was found (there are two elements, get the 2nd)
        */
        const parcelQuestPaginationArray = await driver.findElements(
          By.css(websiteSelectors.parcelQuestPagination, "css")
        );
        const parcelQuestPaginationCorrectEle = parcelQuestPaginationArray[1];
        const paginationString =
          await parcelQuestPaginationCorrectEle.getAttribute("innerText");
        if (paginationString === "-1") {
          arrayOfFailedOperations.push(item);

          await sendMessageToFrontEnd(
            ipcBusClientNodeMain,
            "Failed Iteration",
            {
              primaryMessage: item,
              messageColor: null,
              errorMessage: `Parcel quest failed to render the tax data for: ${item.ParcelNumber}.`,
            }
          );
          await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
            primaryMessage: `Parcel quest failed to render the tax data for: ${item.ParcelNumber}.`,
            messageColor: "red",
            errorMessage: null,
          });

          await pressHomeButton(driver);
          continue;
        }

        /* 
          Now ensure that we are on the tax bill data tab
        */

        const navigatedToBillSuccessfully = await fluentWait(
          driver,
          websiteSelectors.taxSummaryDiv,
          "xpath",
          20,
          2
        );
        if (navigatedToBillSuccessfully === false) {
          arrayOfFailedOperations.push(item);

          await sendMessageToFrontEnd(
            ipcBusClientNodeMain,
            "Failed Iteration",
            {
              primaryMessage: item,
              messageColor: null,
              errorMessage: `Failed to navigate to the bill for parcel: ${item.ParcelNumber}.`,
            }
          );
          await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
            primaryMessage: `Failed to navigate to the bill for parcel: ${item.ParcelNumber}.`,
            messageColor: "red",
            errorMessage: null,
          });

          await pressHomeButton(driver);
          continue;
        }

        /* 
            Download the bill
        */
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Downloading bill for: ${item.ParcelNumber}`,
          messageColor: "blue",
          errorMessage: null,
        });

        const fileNameForFile = replaceSpacesWithUnderscore(
          `${item.CompanyName} ${item.EntityName} ${item.ParcelNumber}`
        );
        const billDownloadedSuccessfully = await printPageToPDF(
          driver,
          downloadDirectory,
          fileNameForFile,
          websiteSelectors.screenShotSelector,
          false
        );
        if (billDownloadedSuccessfully === false) {
          arrayOfFailedOperations.push(item);

          await sendMessageToFrontEnd(
            ipcBusClientNodeMain,
            "Failed Iteration",
            {
              primaryMessage: item,
              messageColor: null,
              errorMessage: `Failed to download the bill for parcel: ${item.ParcelNumber}.`,
            }
          );
          await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
            primaryMessage: `Failed to download the bill for parcel: ${item.ParcelNumber}.`,
            messageColor: "red",
            errorMessage: null,
          });

          await pressHomeButton(driver);
          continue;
        }
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Bill for: ${item.ParcelNumber} downloaded successfully`,
          messageColor: "purple",
          errorMessage: null,
        });

        /* 
            Pull Tax Data Strings
        */

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Pulling Tax Data for: ${item.ParcelNumber}`,
          messageColor: "orange",
          errorMessage: null,
        });

        let taxDataStringObject = await pullTaxBillStrings(
          driver,
          taxYear,
          county,
          websiteSelectors
        );
        if (checkIfObjectIsEmpty(taxDataStringObject)) {
          /* 
            Try getting tax data one more time in case
            parcelQuest failed to load
          */
          await pressHomeButton(driver);
          taxDataStringObject = await pullTaxBillStrings(
            driver,
            taxYear,
            county,
            websiteSelectors
          );
          /* 
            If this still returns 0, something else is wrong
          */
          if (checkIfObjectIsEmpty(taxDataStringObject)) {
            arrayOfFailedOperations.push(item);

            await sendMessageToFrontEnd(
              ipcBusClientNodeMain,
              "Failed Iteration",
              {
                primaryMessage: item,
                messageColor: null,
                errorMessage: `Failed to pull tax data for parcel: ${item.ParcelNumber}.`,
              }
            );
            await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
              primaryMessage: `Failed to pull tax data for parcel: ${item.ParcelNumber}.`,
              messageColor: "red",
              errorMessage: null,
            });

            await pressHomeButton(driver);
            continue;
          }
        }
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Total taxes due: ${taxDataStringObject.totalTaxesDue} || Total NAVs due: ${taxDataStringObject.totalNAVs}`,
          messageColor: "regular",
          errorMessage: null,
        });

        /* 
            Ptax Data Entry
        */

        // Navigate to parcel in PTax
        await switchToPTaxTab(driver, ptaxWindow);
        await driver.navigate().refresh();
        await swapToIFrameDefaultContent(driver);
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Searching for: ${item.ParcelNumber} in Ptax`,
          messageColor: "orange",
          errorMessage: null,
        });

        const searchByParcelInput = await awaitElementLocatedAndReturn(
          driver,
          searchByParcelNumberSelector,
          "id"
        );
        await sendKeysInputFields(searchByParcelInput, item.ParcelNumber, true);

        await swapToIFrame0(driver);
        const propertySideBarXPath = generateDynamicXPath(
          "a",
          item.ParcelNumber,
          "contains"
        );
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: "Navigating to existing assessment",
          messageColor: "orange",
          errorMessage: null,
        });
        const propertyToAddTaxBill = await awaitElementLocatedAndReturn(
          driver,
          propertySideBarXPath,
          "xpath"
        );
        await propertyToAddTaxBill.click();
        await driver.sleep(2500);

        /* 
          ? Per April some counties might have more than one assessment,
          ? need to circle back with her to figure out how to handle
          ? this edge case
        */
        await swapToIFrame1(driver);
        await navigateToExistingAssessment(driver);

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Performing Data Entry for: ${item.ParcelNumber}`,
          messageColor: "yellow",
          errorMessage: null,
        });

        // Change Assessment Data Source to ParcelQuest and save
        await selectDropdownElement(
          driver,
          taxBillSelectors.dataSourceAssessment,
          "ParcelQuest"
        );
        const saveAssessmentButton = await awaitElementLocatedAndReturn(
          driver,
          taxBillSelectors.btnSaveAssessment,
          "id"
        );
        await scrollElementIntoView(driver, saveAssessmentButton);
        await saveAssessmentButton.click();
        await waitForLoading(driver);

        // Fill out the input fields and save
        await fillOutLiability(
          driver,
          taxBillSelectors,
          taxDataStringObject.totalTaxesDue,
          taxDataStringObject.totalNAVs
        );

        const installmentStringOne =
          taxDataStringObject.installmentOneAmountDue;

        const installmentStringTwo =
          taxDataStringObject.installmentTwoAmountDue;

        await fillOutPayments(
          driver,
          taxBillSelectors,
          installmentStringOne,
          installmentStringTwo,
          installmentNumber
        );

        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Uploading Bill for: ${item.ParcelNumber}`,
          messageColor: "yellow",
          errorMessage: null,
        });
        // Upload Document
        await uploadTaxBill(
          driver,
          fileNameForFile,
          taxYear,
          taxYearEnd,
          downloadDirectory,
          "Annual (PQ)"
        );
        await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
          primaryMessage: `Bill successfully uploaded for: ${item.ParcelNumber}`,
          messageColor: "regular",
          errorMessage: null,
        });

        await swapToIFrame0(driver);
        await switchToTaxWebsiteTab(driver, taxWebsiteWindow);
        const homeButton = await awaitElementLocatedAndReturn(
          driver,
          websiteSelectors.homeButton,
          "css"
        );
        await homeButton.click();

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

        const urlPostFailure = await driver.getCurrentUrl();
        if (urlPostFailure !== parcelQuestHomePage) {
          await switchToTaxWebsiteTab(taxWebsiteWindow);
        }
        arrayOfFailedOperations.push(item);
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

    await closingAutomationSystem(driver);
  } catch (error) {
    logErrorMessageCatch(error);
  }
};

module.exports = performDataEntryAndDownload;
