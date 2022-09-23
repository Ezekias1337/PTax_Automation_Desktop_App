export const findKeyValuePairsPath = (keyToFind, valueToFind, element) => {
  if (
    (keyToFind === undefined || keyToFind === null) &&
    (valueToFind === undefined || valueToFind === null)
  ) {
    console.error("You have to pass key and/or value to find in element!");
    return [];
  }

  const parsedElement = JSON.parse(JSON.stringify(element));
  const paths = [];

  if (this.isObject(parsedElement) || this.isArray(parsedElement)) {
    checkObjOrArr(parsedElement, keyToFind, valueToFind, "baseElement", paths);
  } else {
    console.error("Element must be an Object or Array type!", parsedElement);
  }

  console.warn("Main element", parsedElement);
  return paths;
};

const isObject = (elem) => {
  return elem && typeof elem === "object" && elem.constructor === Object;
};

const isArray = (elem) => {
  return Array.isArray(elem);
};

const checkObj = (obj, keyToFind, valueToFind, path, paths) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (!keyToFind && valueToFind === value) {
      // we are looking for value only
      paths.push(`${path}.${key}`);
    } else if (!valueToFind && keyToFind === key) {
      // we are looking for key only
      paths.push(path);
    } else if (key === keyToFind && value === valueToFind) {
      // we are looking for key: value pair
      paths.push(path);
    }

    checkObjOrArr(value, keyToFind, valueToFind, `${path}.${key}`, paths);
  });
};

const checkArr = (array, keyToFind, valueToFind, path, paths) => {
  array.forEach((elem, i) => {
    if (!keyToFind && valueToFind === elem) {
      // we are looking for value only
      paths.push(`${path}[${i}]`);
    }
    checkObjOrArr(elem, keyToFind, valueToFind, `${path}[${i}]`, paths);
  });
};

const checkObjOrArr = (elem, keyToFind, valueToFind, path, paths) => {
  if (this.isObject(elem)) {
    checkObj(elem, keyToFind, valueToFind, path, paths);
  } else if (this.isArray(elem)) {
    checkArr(elem, keyToFind, valueToFind, path, paths);
  }
};
