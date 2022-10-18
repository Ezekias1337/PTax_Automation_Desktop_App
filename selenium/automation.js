const { mainMenu } = require("./functions/userPrompts/mainMenu");

const automation = async (automationConfigObject) => {
  await mainMenu(automationConfigObject);
};

module.exports = { automation };
