const findArrayIndexWithObject = (depth, array) => {
  for (const item of array) {
    if (item[1]?.key) {
      /* 
        console.log("item[1]: ", item[1]);
        console.log("Object.entries(item[1]): ", Object.entries(item[1]));
      */
      return Object.entries(item[1]);
    }
  }
};

export const accessNestedArray = (depth, array) => {
  let numOfRecursions = 0;
  let desiredElement;
  let currentArrayLayer;
  const topLvlArray = Object.entries(array);

  while (numOfRecursions < depth) {
    if (currentArrayLayer === undefined) {
      currentArrayLayer = findArrayIndexWithObject(depth, topLvlArray);
    } else {
      currentArrayLayer = findArrayIndexWithObject(depth, currentArrayLayer);
    }

    numOfRecursions++;
  }

  return desiredElement;
};
