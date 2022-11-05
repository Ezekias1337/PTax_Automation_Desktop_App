export const buildInitialState = (constants) => ({
  messages: constants.reduce((retObj, constant) => {
    retObj[constant] = [];
    return retObj;
  }, {}),
  errors: constants.reduce((retObj, constant) => {
    retObj[constant] = [];
    return retObj;
  }, {}),
  loading: constants.reduce((retObj, constant) => {
    retObj[constant] = false;
    return retObj;
  }, {}),
  contents: constants.reduce((retObj, constant) => {
    retObj[constant] = [];
    return retObj;
  }, {}),
});
