// Functions, Helpers, Utils
import { camelCasifyString } from "../utils/strings/camelCasifyString";

export const generateEventTargetStructure = (inputName, inputValue) => {
  const e = {
    target: {
      name: camelCasifyString(inputName),
      value: inputValue,
    },
  };
  
  return e;
};
