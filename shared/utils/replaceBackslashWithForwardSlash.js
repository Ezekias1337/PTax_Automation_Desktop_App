/* 
  Converts Windows File Paths to Unix (Mac/Linux)
*/

const replaceBackslashWithForwardSlash = (string) => {
  return string.replace(/\\/g, "/");
};

module.exports = { replaceBackslashWithForwardSlash };
