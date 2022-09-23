const scrollWindow = async (driver, xPixels = 0, yPixels = 0) => {
    await driver.executeScript(
        `window.scrollBy(${xPixels},${yPixels})`
    );
};
  
module.exports = scrollWindow;