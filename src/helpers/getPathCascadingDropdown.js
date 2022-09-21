import { camelCasifyString } from "../utils/camelCasifyString";

export const getPathCascadingDropdown = (question, getFirst) => {
  /* 
    For the dependant dropdowns, when a parent's value is changed
    the children must change their available options. The path 
    which is needed to accomplish this is returned from this function.
  */

  const levelsOfNesting = question.parentQuestions.length;
  let pathToDesiredElement = "";

  for (const [index, item] of question.parentQuestions.entries()) {
    if (levelsOfNesting === index - 1) {
      pathToDesiredElement += item + "[0]";
    } else {
      pathToDesiredElement += item + "[0].";
    }
  }

  pathToDesiredElement += camelCasifyString(question.name);

  if (getFirst === true) {
    pathToDesiredElement += camelCasifyString(question.name) + "[0]";
  }

  return pathToDesiredElement;
};
