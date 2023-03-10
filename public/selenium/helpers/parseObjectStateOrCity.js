const parseObjectStateOrCity = (objectToParse, stateOrCityOrOperation) => {
  const objConvertedToArray = [];

  for (const item of objectToParse) {
    if (stateOrCityOrOperation === "state") {
      if (item?.key && item?.state) {
        objConvertedToArray.push(item);
      }
    } else if (
      stateOrCityOrOperation === "city" ||
      stateOrCityOrOperation === "operation"
    ) {
      if (item?.key && item?.name) {
        objConvertedToArray.push(item);
      }
    }
  }
  return objConvertedToArray;
};

module.exports = parseObjectStateOrCity;
