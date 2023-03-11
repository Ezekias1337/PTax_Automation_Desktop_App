// Library Imports
const { Key, until } = require("selenium-webdriver");
// Functions, Helpers, Utils
const awaitElementLocatedAndReturn = require("../../../../../utils/waits/awaitElementLocatedAndReturn");

const loginToParcelQuest = async (
  driver,
  username,
  password,
  selectors,
  parcelQuestLoginPage,
  homePageUrl
) => {
  try {
    /* 
      ! Later make sure to add code to check the checkbox,
      ! potentially remove the need to re-log in
    */
    await driver.get(parcelQuestLoginPage);

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

    /* 
      Check the URL after 5 seconds, if it's not the homepageUrl,
      then recursively reload page and keep trying until the login
      is successful
    */
    await driver.sleep(5000);
    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl !== homePageUrl) {
      await driver.navigate().refresh();
      await loginToParcelQuest(
        driver,
        username,
        password,
        selectors,
        parcelQuestLoginPage,
        homePageUrl
      );
    }

    await driver.wait(until.urlIs(homePageUrl));
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = loginToParcelQuest;
