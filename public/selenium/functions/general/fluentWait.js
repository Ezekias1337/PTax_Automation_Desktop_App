const { until, By } = require("selenium-webdriver");

const fluentWait = async (
  driver,
  selector,
  method,
  secondsToSearch,
  checkFrequency,
  timeOutMessage = "Fluent wait timed out!"
) => {
  let elementIsFound = false;
  try {
    switch (method) {
      case "className":
        elementIsFound = await driver.wait(
          until.elementLocated(By.className(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      case "css":
        elementIsFound = await driver.wait(
          until.elementLocated(By.css(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      case "id":
        elementIsFound = await driver.wait(
          until.elementLocated(By.id(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      case "name":
        elementIsFound = await driver.wait(
          until.elementLocated(By.name(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      case "linkText":
        elementIsFound = await driver.wait(
          until.elementLocated(By.linkText(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      case "partialLinkText":
        elementIsFound = await driver.wait(
          until.elementLocated(By.partialLinkText(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      case "tagName":
        elementIsFound = await driver.wait(
          until.elementLocated(By.tagName(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      case "xpath":
        elementIsFound = await driver.wait(
          until.elementLocated(By.xpath(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        break;
      default:
        console.log("No match found for element locator method");
    }
    return elementIsFound;
  } catch (error) {
    return elementIsFound;
  }
};

module.exports = fluentWait;
