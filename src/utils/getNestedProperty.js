export const getNestedProperty = (property, object) => {
  const retrievedProperty = (object) => {
    if (object && typeof object === "object") {
      return Object.entries(object)
        .map(([key, value]) =>
          key === property ? value : retrievedProperty(value)
        )
        .filter(Boolean)
        .shift();
    }
  };

  return retrievedProperty(object);
};
