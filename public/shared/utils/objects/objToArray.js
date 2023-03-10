const objectToArray = (objectToParse, desiredAttribute) => {
  const objConvertedToArray = [];
  const objectToParseEntries = Object.entries(objectToParse);

  for (const item of objectToParseEntries) {
    for (const nestedItem of item) {
      if (nestedItem?.key && nestedItem[desiredAttribute]) {
        objConvertedToArray.push(nestedItem);
      }
    }
  }
  return objConvertedToArray;
};

module.exports = objectToArray;
