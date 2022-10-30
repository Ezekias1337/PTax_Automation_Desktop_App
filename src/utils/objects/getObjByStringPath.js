export const getObjByStringPath = (object, string) => {
  try {
    // Convert indexes to properties
    string = string.replace(/\[(\w+)\]/g, ".$1");
    // Strip a leading dot
    string = string.replace(/^\./, "");
    var a = string.split(".");
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in object) {
        object = object[k];
      } else {
        return;
      }
    }
    return object;
  } catch (error) {
    // If you pass in an invalid path, it'll error out and return null instead
    return null;
  }
};
