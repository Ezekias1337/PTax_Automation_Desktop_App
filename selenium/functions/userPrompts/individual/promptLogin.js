const prompt = require("prompt-sync")();

const promptLogin = async () => {
  console.log("\n");
  console.log("This automation requires logging into PTax.");
  console.log("\n");
  console.log("In order to log into PTax, enter your login credentials: ");
  console.log("\n");
  const username = prompt("Enter username: ");
  const password = prompt("Enter password: ");

  const loginCredentials = { username: username, password: password };

  return loginCredentials;
};

module.exports = promptLogin;
