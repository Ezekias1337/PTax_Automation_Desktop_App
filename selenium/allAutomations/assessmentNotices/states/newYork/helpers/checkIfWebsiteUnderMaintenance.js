const checkIfWebsiteUnderMaintenance = async (driver) => {
  try {
    await driver.findElement(
      By.xpath(assessmentWebsiteSelectors.websiteMaintenanceWarner)
    );
    console.log("Website is under maintenance, unable to proceed.");
    await closingAutomationSystem();
    return true;
  } catch (error) {
    console.log("Website not under maintance. Continuing.");
    return false;
  }
};

module.exports = checkIfWebsiteUnderMaintenance;
