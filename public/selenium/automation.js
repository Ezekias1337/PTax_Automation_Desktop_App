const { mainMenu } = require("./functions/userPrompts/mainMenu");

const automation = async (automationConfigObject, ipcBusClientNodeMain) => {
  await mainMenu(automationConfigObject, ipcBusClientNodeMain);
};

module.exports = { automation };
