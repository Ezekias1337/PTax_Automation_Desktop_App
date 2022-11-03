/* 
  Converts Unix (Mac/Linux) File Paths to Windows
*/

const replaceForwardslashWithBackwardSlash = (string) => {
  return string.replace(/\//g, "\\");
};

module.exports = { replaceForwardslashWithBackwardSlash };
