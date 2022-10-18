const findOptionByKey = require("./parsing/findOptionByKey");
const parseNestedObjectMainMenu = require("./parsing/parseNestedObjectMainMenu");
const parseObjectMainMenu = require("./parsing/parseObjectMainMenu");
const listOfAutomations = require("../../allAutomations/listOfAutomations/listOfAutomations");

const mainMenu = async (automationConfigObject) => {
  console.table(automationConfigObject);

  /* 
    First select an automation that you want to perform
  */

  const objToArraySelectAutomation =
    parseNestedObjectMainMenu(listOfAutomations);
  const selectedAutomationInput = automationConfigObject.automation;

  let selectedOperation = null;
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
    const objToArraySelectLocation = parseObjectMainMenu(
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
      If the selected operation has a choice of specific operations, 
      prompt the user
    */

    if (selectedAutomation?.operations?.length > 0) {
      const objToArraySelectOperation = parseObjectMainMenu(
        selectedAutomation.operations,
        "operation"
      );
      const selectedOperationInput = automationConfigObject.operation;

      selectedOperation = findOptionByKey(
        objToArraySelectOperation,
        selectedOperationInput,
        "name"
      );
    }

    /* 
      If the state has a list of sublocations, prompt the user
    */

    if (selectedAutomation?.WIP === true) {
      console.log(
        "This automation has not yet been added, but is planned for the future."
      );
    } else if (selectedState?.subLocations?.length > 0) {
      const objToArraySelectSublocation = parseObjectMainMenu(
        selectedState.subLocations,
        "city"
      );
      const selectedSublocationInput = automationConfigObject.county;

      const selectedSublocation = findOptionByKey(
        objToArraySelectSublocation,
        selectedSublocationInput,
        "name"
      );

      selectedSublocation.function(automationConfigObject);
    }
  } else if (selectedAutomation?.function) {
    selectedAutomation.function(automationConfigObject);
  }
};

module.exports = { mainMenu };
