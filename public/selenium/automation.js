// Functions, Helpers, Utils
const findOptionByKey = require("./helpers/findOptionByKey");
const parseNestedObjectAutomation = require("./helpers/parseNestedObjectAutomation");
const parseObjectStateOrCity = require("./helpers/parseObjectStateOrCity");
// Constants
const automationList = require("./constants/automation-list/automationList");

const automation = async (automationConfigObject, ipcBusClientNodeMain) => {
  /* 
    First select an automation that you want to perform
  */

  const objToArraySelectAutomation =
    parseNestedObjectAutomation(automationList);
  const selectedAutomationInput = automationConfigObject.automation;

  const selectedAutomation = findOptionByKey(
    objToArraySelectAutomation,
    selectedAutomationInput,
    "name"
  );

  /* 
    If the automation has a state to select, parse the object
    to find the correct option
  */

  if (selectedAutomation?.locations?.length > 0) {
    const objToArraySelectLocation = parseObjectStateOrCity(
      selectedAutomation.locations,
      "state"
    );
    const selectedStateInput = automationConfigObject.state;

    const selectedState = findOptionByKey(
      objToArraySelectLocation,
      selectedStateInput,
      "state"
    );

    /* 
      If the state has a list of sublocations, select the right one
    */

    if (selectedState?.subLocations?.length > 0) {
      const objToArraySelectSublocation = parseObjectStateOrCity(
        selectedState.subLocations,
        "city"
      );
      const selectedSublocationInput = automationConfigObject.county;

      const selectedSublocation = findOptionByKey(
        objToArraySelectSublocation,
        selectedSublocationInput,
        "name"
      );

      selectedSublocation.function(
        automationConfigObject,
        ipcBusClientNodeMain
      );
    }
  } else if (selectedAutomation?.function) {
    selectedAutomation.function(automationConfigObject, ipcBusClientNodeMain);
  }
};

module.exports = { automation };
