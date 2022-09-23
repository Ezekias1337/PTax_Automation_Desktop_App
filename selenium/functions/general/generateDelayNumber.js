const colors = require('colors');

const generateDelayNumber = () => {
  const amountToSleep = Math.floor (
    Math.random () * (25000 - 13000 + 1) + 13000
  );
  console.log(
    colors.magenta.bold(`Sleeping for: ${amountToSleep / 1000} seconds.`)
  );
  return amountToSleep;
};

module.exports = generateDelayNumber;