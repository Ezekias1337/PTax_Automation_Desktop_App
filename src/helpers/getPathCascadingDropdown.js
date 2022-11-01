// Functions, Helpers, Utils
import { camelCasifyString } from "../utils/strings/camelCasifyString";

export const getPathCascadingDropdown = (
  question,
  getFirst,
  parentIndex = 0
) => {
  /* 
    For the dependant dropdowns, when a parent's value is changed
    the children must change their available options. The path 
    which is needed to accomplish this is returned from this function.
  */

  const levelsOfNesting = question.parentQuestions.length;
  let pathToDesiredElement = "";
  let parentIndexAccountedFor = false;

  for (const [index, item] of question.parentQuestions.entries()) {
    if (parentIndexAccountedFor === false) {
      pathToDesiredElement += item + `[${parentIndex}].`;
      parentIndexAccountedFor = true;
    } else if (levelsOfNesting === index - 1) {
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
