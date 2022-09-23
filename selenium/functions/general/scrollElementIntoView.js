const scrollElementIntoView = async (driver, elementToScrollIntoView) => {
  await driver.executeScript(
    "arguments[0].scrollIntoView({block: 'end'})",
    elementToScrollIntoView
  );
  await driver.sleep(1000);
};

module.exports = scrollElementIntoView;