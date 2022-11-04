const checkIfSessionExpired = async (driver, assessmentWebsiteSelectors) => {
  /* 
      If the script has been executing for a long time, the session times out and
      redirects to the homepage. This checks if this occurred, and if it has,
      then it will click the BBL Search button to proceed execution
  */
  const checkURL = await driver.getCurrentUrl();
  if (checkURL.includes(".aspx?mode=content/home.htm")) {
    const bblSearchBtn = await driver.findElement(
      By.xpath(assessmentWebsiteSelectors.bblSearchBtn)
    );
    await bblSearchBtn.click();
  }
};

module.exports = checkIfSessionExpired;
