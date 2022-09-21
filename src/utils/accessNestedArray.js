const findArrayIndexWithObject = (depth, array) => {
  for (const item of array) {
    if (item[1]?.key) {
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
      /* console.log("currentArrayLayer: ", currentArrayLayer) */
    } else {
      /* console.log("currentArrayLayer else: ", currentArrayLayer) */
      currentArrayLayer = findArrayIndexWithObject(depth, currentArrayLayer);
      /* console.log("currentArrayLayer: ", currentArrayLayer); */
    }

    numOfRecursions++;
  }

  /* desiredElement = currentArrayLayer.find((arr) => arr[0] === "name");
  console.log("desiredElement: ", desiredElement) */

  return desiredElement;
};
