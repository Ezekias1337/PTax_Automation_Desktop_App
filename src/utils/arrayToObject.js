export const arrayToObject = (array) => {
  let values = Array.isArray(array) ? arrayToObject(array[0]) : array;
  if (typeof values === "object") {
    return Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, arrayToObject(v)])
    );
  } else {
    return values;
  }
};
