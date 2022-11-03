/* 
  Converts Windows File Paths to Unix (Mac/Linux)
*/

export const replaceBackslashWithForwardSlash = (string) => {
  return string.replace(/\\/g, "/");
};
