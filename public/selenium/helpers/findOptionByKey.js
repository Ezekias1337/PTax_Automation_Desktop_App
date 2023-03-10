const findOptionByKey = (
  objToArraySelectAutomation,
  selectedAutomationInput,
  keyToFindMatch
) => {
  
  const selectedAutomation = objToArraySelectAutomation.find(
    (automation) => automation[keyToFindMatch] === selectedAutomationInput
  );

  return selectedAutomation;
};

module.exports = findOptionByKey;
