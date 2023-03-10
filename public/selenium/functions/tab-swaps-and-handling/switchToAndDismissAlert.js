const switchToAndDismissAlert = async (driver) => {
  try {
    // Store the alert in a variable
    let alert = await driver.switchTo().alert();

    //Press the OK button
    await alert.accept();
    console.log("Alert Dismissed");
  } catch (error) {
    console.log("No alert to dismiss");
  }
};

module.exports = switchToAndDismissAlert;
