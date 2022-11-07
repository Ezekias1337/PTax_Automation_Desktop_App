/* 
  Converts Unix (Mac/Linux) File Paths to Windows
*/

const replaceSpacesWithUnderscore = (string) => {
  return string.replace(/ /g, "_");
};

module.exports = { replaceSpacesWithUnderscore };
