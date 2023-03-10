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
  let locatedElement;
  let queryLength = 0;
  try {
    switch (method) {
      case "className":
        locatedElement = await driver.wait(
          until.elementLocated(By.className(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        locatedElement = await driver.findElements(By.className(selector));
        queryLength = locatedElement?.length;
        break;
      case "css":
        locatedElement = await driver.wait(
          until.elementLocated(By.css(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        locatedElement = await driver.findElements(By.css(selector));
        queryLength = locatedElement?.length;
        break;
      case "id":
        locatedElement = await driver.wait(
          until.elementLocated(By.id(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        locatedElement = await driver.findElements(By.id(selector));
        queryLength = locatedElement?.length;
        break;
      case "name":
        locatedElement = await driver.wait(
          until.elementLocated(By.name(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        locatedElement = await driver.findElements(By.name(selector));
        queryLength = locatedElement?.length;
        break;
      case "linkText":
        locatedElement = await driver.wait(
          until.elementLocated(By.linkText(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        locatedElement = await driver.findElements(By.linkText(selector));
        queryLength = locatedElement?.length;
        break;
      case "partialLinkText":
        locatedElement = await driver.wait(
          until.elementLocated(By.partialLinkText(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        locatedElement = await driver.findElements(
          By.partialLinkText(selector)
        );
        queryLength = locatedElement?.length;
        break;
      case "tagName":
        locatedElement = await driver.wait(
          until.elementLocated(By.tagName(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        locatedElement = await driver.findElements(By.tagName(selector));
        queryLength = locatedElement?.length;
        break;
      case "xpath":
        locatedElement = await driver.wait(
          until.elementLocated(By.xpath(selector)),
          secondsToSearch * 1000,
          timeOutMessage,
          checkFrequency * 1000
        );
        locatedElement = await driver.findElements(By.xpath(selector));
        queryLength = locatedElement?.length;
        break;
      default:
        console.log("No match found for element locator method");
    }
    if (queryLength > 0) {
      elementIsFound = true;
    }
    return elementIsFound;
  } catch (error) {
    return elementIsFound;
  }
};

module.exports = fluentWait;
