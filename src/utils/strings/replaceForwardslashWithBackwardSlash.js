/* 
  Converts Unix (Mac/Linux) File Paths to Windows
*/

export const replaceForwardslashWithBackwardSlash = (string) => {
  return string.replace(/\//g, "\\");
};
