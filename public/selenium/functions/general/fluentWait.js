const { until, By } = require("selenium-webdriver");

const fluentWait = async (
  driver,
  selector,
  method,
  secondsToSearch,
  checkFrequency,
  timeOutMessage = "Fluent wait timed out!"
) => {
  try {
    switch (method) {
      case "className":
        await driver.wait(
          until.elementLocated(By.className(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      case "css":
        await driver.wait(
          until.elementLocated(By.css(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      case "id":
        await driver.wait(
          until.elementLocated(By.id(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      case "name":
        await driver.wait(
          until.elementLocated(By.name(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      case "linkText":
        await driver.wait(
          until.elementLocated(By.linkText(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      case "partialLinkText":
        await driver.wait(
          until.elementLocated(By.partialLinkText(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );

        break;
      case "tagName":
        await driver.wait(
          until.elementLocated(By.tagName(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      case "xpath":
        await driver.wait(
          until.elementLocated(By.xpath(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      default:
        console.log("No match found for element locator method");
    }
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = fluentWait;
