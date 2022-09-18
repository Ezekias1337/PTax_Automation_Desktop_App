import { camelCasifyString } from "../utils/camelCasifyString";

export const generateEventTargetStructure = (inputName, inputValue) => {
  const e = {
    target: {
      name: camelCasifyString(inputName),
      value: inputValue,
    },
  };
  
  return e;
};
