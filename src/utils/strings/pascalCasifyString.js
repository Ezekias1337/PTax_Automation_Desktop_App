// Functions, Helpers, Utils
import { camelCasifyString } from "./camelCasifyString";

export const pascalCasifyString = (string) => {
  const camelCasifiedString = camelCasifyString(string);
  const newString = camelCasifiedString
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();

  return newString;
};
