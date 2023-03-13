// Library Imports
const colors = require("colors");
// Functions, Helpers, Utils
const buildDriver = require("../../functions/driver/buildDriver");

const handleGlobalError = require("../../helpers/handleGlobalError");

const propertyPointOfContact = async (sublocation) => {
  const driver = await buildDriver(ipcBusClientNodeMain);
  console.log(
    `Running change property point of contact automation for: ${sublocation}`
  );
};

async function updatePropertyPOC(property, producingLeader, producer) {
  try {
    const propertyXPath = `//*[text()='${property}']`;

    let driver = await new Builder().forBrowser("chrome").build();
    await driver.get("https://ptax.ptaxsolution.com/Default.aspx");

    //await driver.manage().window().fullscreen();

    await driver.findElement(By.name("txtUserName")).sendKeys("fedwards");
    await driver
      .findElement(By.name("txtPassword"))
      .sendKeys("p@ssw0rd", Key.RETURN);

    //swap to iframe
    await driver.switchTo().frame(0);

    //swaps back to normal if needed for later
    /* await driver.switchTo().defaultContent(); */

    let checkBox = await driver.wait(
      until.elementLocated(By.name("CheckMyProperties"))
    );
    await driver.findElement(By.id("CheckMyProperties")).click();

    await driver
      .findElement(By.xpath("/html/body/form/div[4]/ul/li[24]/div/span[2]"))
      .click();
    /* "fmeMain" */

    let propertyToClick = await driver.wait(
      until.elementLocated(By.xpath(propertyXPath))
    );
    await propertyToClick.click();

    await driver.switchTo().defaultContent();
    // Store the web element
    const iframe = driver.findElement(By.css("#fmeMain"));
    // Switch to the frame
    await driver.switchTo().frame(iframe);

    for (const x of placeholder) {
      try {
        let editPropertyButton = await driver.wait(
          until.elementLocated(
            By.xpath(
              "/html/body/form/div[4]/table/tbody/tr/td[1]/table[1]/tbody/tr[3]/td[2]/span/button"
            )
          )
        );
        await editPropertyButton.click();

        let clientPOC = await driver.wait(
          until.elementLocated(
            By.xpath(
              "/html/body/form/div[14]/table/tbody/tr[3]/td[2]/select/option[24]"
            )
          )
        );
        await clientPOC.click();

        if (producingLeader === "Nick") {
          const producingLeaderXPath =
            "/html/body/form/div[14]/table/tbody/tr[4]/td[2]/select/option[18]";
          let producingOfficerLeader = await driver.wait(
            until.elementLocated(By.xpath(producingLeaderXPath))
          );
          await producingOfficerLeader.click();
        } else if (producingLeader === "Tim") {
          const producingLeaderXPath =
            "/html/body/form/div[14]/table/tbody/tr[4]/td[2]/select/option[23]";
          let producingOfficerLeader = await driver.wait(
            until.elementLocated(By.xpath(producingLeaderXPath))
          );
          await producingOfficerLeader.click();
        } else if (producingLeader === "Chelley") {
          const producingLeaderXPath =
            "/html/body/form/div[14]/table/tbody/tr[4]/td[2]/select/option[5]";
          let producingOfficerLeader = await driver.wait(
            until.elementLocated(By.xpath(producingLeaderXPath))
          );
          await producingOfficerLeader.click();
        } else if (producingLeader === "Chelsea") {
          const producingLeaderXPath =
            "/html/body/form/div[14]/table/tbody/tr[4]/td[2]/select/option[6]";
          let producingOfficerLeader = await driver.wait(
            until.elementLocated(By.xpath(producingLeaderXPath))
          );
          await producingOfficerLeader.click();
        }

        if (producer === "Chase") {
          const producerXPath =
            "/html/body/form/div[14]/table/tbody/tr[5]/td[2]/select/option[4]";
          let producerToClick = await driver.wait(
            until.elementLocated(By.xpath(producerXPath))
          );
          await producerToClick.click();
        } else if (producer === "Justin") {
          const producerXPath =
            "/html/body/form/div[14]/table/tbody/tr[5]/td[2]/select/option[15]";
          let producerToClick = await driver.wait(
            until.elementLocated(By.xpath(producerXPath))
          );
          await producerToClick.click();
        } else if (producer === "David") {
          const producerXPath =
            "/html/body/form/div[14]/table/tbody/tr[5]/td[2]/select/option[8]";
          let producerToClick = await driver.wait(
            until.elementLocated(By.xpath(producerXPath))
          );
          await producerToClick.click();
        } else if (producer === "Jenn") {
          const producerXPath =
            "/html/body/form/div[14]/table/tbody/tr[5]/td[2]/select/option[13]";
          let producerToClick = await driver.wait(
            until.elementLocated(By.xpath(producerXPath))
          );
          await producerToClick.click();
        }

        await driver.findElement(By.id("SaveButton")).click();
      } catch (error) {}
    }
  } catch (error) {
    await handleGlobalError(ipcBusClientNodeMain, error.message);
  }
}

//updatePropertyPOC('The Globe','Tim','Justin');

module.exports = propertyPointOfContact;
