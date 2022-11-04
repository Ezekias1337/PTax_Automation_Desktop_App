const colors = require("colors");

const generateDynamicXPath = (
  elementType,
  textToSearchFor,
  containsOrEquals
) => {
  let xpathToReturn;

  if (containsOrEquals === "contains") {
    xpathToReturn = `//${elementType}[contains(text(), '${textToSearchFor}')]`;
  } else if (containsOrEquals === "equals") {
    xpathToReturn = `//*[text()='${textToSearchFor}']`;
  } else {
    xpathToReturn = "failed";
    console.log(
      colors.red.bold(
        "Failed to generate dynamic xpath. Check the arguments of the function when you're calling"
      )
    );
  }

  return xpathToReturn;
};

module.exports = generateDynamicXPath;
