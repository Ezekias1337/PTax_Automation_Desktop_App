const consoleLogKeyAndName = require("./consoleLogKeyAndName");

const parseNestedObjectMainMenu = (objectToParse) => {
  const objConvertedToArray = [];
  const objectToParseEntries = Object.entries(objectToParse);

  for (const item of objectToParseEntries) {
    for (const nestedItem of item) {
      if (nestedItem?.key && nestedItem?.name) {
        objConvertedToArray.push(nestedItem);
        consoleLogKeyAndName(nestedItem.key, nestedItem.name);
      }
    }
  }
  return objConvertedToArray;
};

module.exports = parseNestedObjectMainMenu;
