const consoleLogKeyAndName = require("./consoleLogKeyAndName");

const parseObjectMainMenu = (objectToParse, stateOrCityOrOperation) => {
  const objConvertedToArray = [];

  for (const item of objectToParse) {
    if (stateOrCityOrOperation === "state") {
      if (item?.key && item?.state) {
        objConvertedToArray.push(item);
        consoleLogKeyAndName(item.key, item.state);
      }
    } else if (
      stateOrCityOrOperation === "city" ||
      stateOrCityOrOperation === "operation"
    ) {
      if (item?.key && item?.name) {
        objConvertedToArray.push(item);
        consoleLogKeyAndName(item.key, item.name);
      }
    }
  }
  return objConvertedToArray;
};

module.exports = parseObjectMainMenu;
