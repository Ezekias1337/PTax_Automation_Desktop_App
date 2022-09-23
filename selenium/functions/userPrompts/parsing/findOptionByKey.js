const findOptionByKey = (
  objToArraySelectAutomation,
  selectedAutomationInput
) => {
  const selectedAutomation = objToArraySelectAutomation.find(
    (automation) => automation.key.toString() === selectedAutomationInput
  );

  return selectedAutomation;
};

module.exports = findOptionByKey;
