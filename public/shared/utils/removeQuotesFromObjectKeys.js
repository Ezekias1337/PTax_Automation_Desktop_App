const removeQuotesFromObjectKeys = (objectToRemoveQuotes) => {
  const objectToReturn = {};

  for (const item of Object.entries(objectToRemoveQuotes)) {
    const key = item[0].split(" ").join("");
    const value = item[1];

    objectToReturn[key] = value;
  }
  return objectToReturn;
};

module.exports = { removeQuotesFromObjectKeys };
