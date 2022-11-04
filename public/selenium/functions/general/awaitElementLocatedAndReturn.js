const { until, By } = require("selenium-webdriver");

const awaitElementLocatedAndReturn = async (
  driver,
  selector,
  method,
  includeLogger = true
) => {
  try {
    let elementToReturn;

    switch (method) {
      case "className":
        await driver.wait(until.elementLocated(By.className(selector)));
        elementToReturn = driver.findElement(By.className(selector));
        break;
      case "css":
        await driver.wait(until.elementLocated(By.css(selector)));
        elementToReturn = driver.findElement(By.css(selector));
        break;
      case "id":
        await driver.wait(until.elementLocated(By.id(selector)));
        elementToReturn = driver.findElement(By.id(selector));
        break;
      case "name":
        await driver.wait(until.elementLocated(By.name(selector)));
        elementToReturn = driver.findElement(By.name(selector));
        break;
      case "linkText":
        await driver.wait(until.elementLocated(By.linkText(selector)));
        elementToReturn = driver.findElement(By.linkText(selector));
        break;
      case "partialLinkText":
        await driver.wait(until.elementLocated(By.partialLinkText(selector)));
        elementToReturn = driver.findElement(By.partialLinkText(selector));
        break;
      case "tagName":
        await driver.wait(until.elementLocated(By.tagName(selector)));
        elementToReturn = driver.findElement(By.tagName(selector));
        break;
      case "xpath":
        await driver.wait(until.elementLocated(By.xpath(selector)));
        elementToReturn = driver.findElement(By.xpath(selector));
        break;
      default:
        console.log("No match found for element locator method");
    }
    return elementToReturn;
  } catch (error) {
    if (includeLogger === true) {
      console.log("Failed to store element, check selector and method");
      console.log(error, error.message);
    }
  }
};

module.exports = awaitElementLocatedAndReturn;
