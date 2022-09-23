const colors = require("colors");
const findOptionByKey = require("./parsing/findOptionByKey");
const parseNestedObjectMainMenu = require("./parsing/parseNestedObjectMainMenu");
const parseObjectMainMenu = require("./parsing/parseObjectMainMenu");
const consoleLogLine = require("../general/consoleLogLine");
const promptSelectAnAutomation = require("./individual/promptSelectAnAutomation");
const promptForState = require("./individual/promptForState");
const promptForSublocation = require("./individual/promptForSublocation");
const promptForOperation = require("./individual/promptForOperation");
const listOfAutomations = require("../../allAutomations/listOfAutomations/listOfAutomations");


const mainMenu = async () => {
  /* 
    First select an automation that you want to perform
  */

  consoleLogLine();
  const objToArraySelectAutomation =
    parseNestedObjectMainMenu(listOfAutomations);
  const selectedAutomationInput = await promptSelectAnAutomation();
  consoleLogLine();

  let selectedOperation = null;
  const selectedAutomation = findOptionByKey(
    objToArraySelectAutomation,
    selectedAutomationInput
  );

  
  /*   If the automation has a function at the root level, run it
 

  if (selectedAutomation?.function) {
    selectedAutomation.function();
  } */

  /* 
    If the automation has a state to select, prompt the user, 
    otherwise run the automation
  */

  if (selectedAutomation?.locations?.length > 0) {
    const objToArraySelectLocation = parseObjectMainMenu(
      selectedAutomation.locations,
      "state"
    );
    const selectedStateInput = await promptForState();
    consoleLogLine();

    const selectedState = findOptionByKey(
      objToArraySelectLocation,
      selectedStateInput
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
      const selectedOperationInput = await promptForOperation();
      consoleLogLine();

      selectedOperation = findOptionByKey(
        objToArraySelectOperation,
        selectedOperationInput
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
      const selectedSublocationInput = await promptForSublocation();
      consoleLogLine();

      const selectedSublocation = findOptionByKey(
        objToArraySelectSublocation,
        selectedSublocationInput
      );

      selectedSublocation.function(
        selectedState.state,
        selectedSublocation.name,
        selectedOperation.name
      );
    }
  } else if (selectedAutomation?.function) {
    selectedAutomation.function();
  }
};

mainMenu();

module.exports = mainMenu;
