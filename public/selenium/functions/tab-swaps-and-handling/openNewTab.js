const openNewTab = async driver => {
  await driver.switchTo ().newWindow ('tab');
};

module.exports = openNewTab;