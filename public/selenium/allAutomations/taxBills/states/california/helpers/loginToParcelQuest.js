const { Key, until } = require("selenium-webdriver");
const awaitElementLocatedAndReturn = require("../../../../../functions/general/awaitElementLocatedAndReturn");

const loginToParcelQuest = async (
  driver,
  username,
  password,
  selectors,
  homePageUrl,
) => {
  try {
    /* 
      ! Later make sure to add code to check the checkbox,
      ! potentially remove the need to re-log in
    */
    
    const userNameInput = await awaitElementLocatedAndReturn(
      driver,
      selectors.userNameInput,
      "id"
    );
    await userNameInput.sendKeys(username);

    const passwordInput = await awaitElementLocatedAndReturn(
      driver,
      selectors.passwordInput,
      "id"
    );
    await passwordInput.sendKeys(password);
    await passwordInput.sendKeys(Key.ENTER);

    await driver.wait(until.urlIs(homePageUrl));
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = loginToParcelQuest;
