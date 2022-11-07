const removeSpecialCharsFromString = (string) => {
  const stringDollarSignRemoved = string.replace("$", "");
  const stringCommasRemoved = stringDollarSignRemoved.replace(/,/g, "");

  return stringCommasRemoved;
};

module.exports = removeSpecialCharsFromString;
