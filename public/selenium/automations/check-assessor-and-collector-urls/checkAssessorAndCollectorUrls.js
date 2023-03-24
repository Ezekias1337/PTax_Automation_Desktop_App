// Functions, Helpers, Utils
const buildDriver = require("../../functions/driver/buildDriver");
const closingAutomationSystem = require("../../functions/driver/closingAutomationSystem");
const sendMessageToFrontEnd = require("../../functions/ipc-bus/sendMessage/sendMessageToFrontEnd");

const checkForDeadLink = require("./helpers/checkForDeadLink");
const checkForPageMoved = require("./helpers/checkForPageMoved");
const handleIterationError = require("../../helpers/handleIterationError");
const handleGlobalError = require("../../helpers/handleGlobalError");

const checkAssessorAndCollectorUrls = async (
  { spreadsheetContents },
  ipcBusClientNodeMain
) => {
  try {
    const driver = await buildDriver(ipcBusClientNodeMain);

    for (const item of spreadsheetContents) {
      await sendMessageToFrontEnd(ipcBusClientNodeMain, "Current Iteration", {
        primaryMessage: item.WebSite,
        messageColor: null,
        errorMessage: null,
      });
      await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
        primaryMessage: `Working on URL: ${item.WebSite}`,
        messageColor: "regular",
        errorMessage: null,
      });

      try {
        if (item?.WebSite === "NULL") {
          await handleIterationError({
            driver,
            ipcBusClientNodeMain,
            message: `Failed for URL: ${item.WebSite}`,
            iterator: item.WebSite,
          });
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

          const isLinkDead = await checkForDeadLink(driver, item);
          if (isLinkDead === true) {
            await handleIterationError({
              driver,
              ipcBusClientNodeMain,
              message: `URL is dead: ${item.WebSite}`,
              iterator: item.WebSite,
            });
          }

          const isPageMoved = await checkForPageMoved(driver);
          if (isPageMoved === true) {
            await handleIterationError({
              driver,
              ipcBusClientNodeMain,
              message: `The page has been moved: ${item.WebSite}`,
              iterator: item.WebSite,
            });
          }

          let itemErrorColRemoved = item;
          if (itemErrorColRemoved?.Error) {
            delete itemErrorColRemoved.Error;
          }

          await sendMessageToFrontEnd(
            ipcBusClientNodeMain,
            "Successful Iteration",
            {
              primaryMessage: itemErrorColRemoved,
            }
          );
          await sendMessageToFrontEnd(ipcBusClientNodeMain, "Event Log", {
            primaryMessage: `Succeeded for URL: ${item.WebSite}`,
            messageColor: "green",
          });
        }
      } catch (error) {
        await handleIterationError({
          driver,
          ipcBusClientNodeMain,
          message: `Failed for URL: ${item.WebSite}`,
          iterator: item.WebSite,
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

module.exports = checkAssessorAndCollectorUrls;
