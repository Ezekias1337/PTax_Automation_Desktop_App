const checkIfObjectIsEmpty = (obj) => {
  if (Object.keys(obj).length === 0) {
    return true;
  } else if (Object.keys(obj).length > 0) {
    return false;
  }
};

module.exports = checkIfObjectIsEmpty;
