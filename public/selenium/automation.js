const { mainMenu } = require("./functions/userPrompts/mainMenu");

const automation = async (automationConfigObject, ipcBusClientNodeMain) => {
  ipcBusClientNodeMain.send("test-connectivity", "Hello from Selenium!");

  await mainMenu(automationConfigObject, ipcBusClientNodeMain);
};

module.exports = { automation };
