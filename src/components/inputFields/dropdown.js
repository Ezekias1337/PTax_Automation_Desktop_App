import { useEffect } from "react";
import { renderDropdownOptionsSettings } from "../../functions/renderDropdownOptionsSettings";
import { renderDropdownStates } from "../../functions/renderDropdownStates";
import { renderDropdownSublocations } from "../../functions/renderDropdownSublocations";
/* import { renderDropdownOperations } from "../../functions/renderDropdownOperations"; */
import { camelCasifyString } from "../../utils/camelCasifyString";
import { handleFormChange } from "../../functions/forms/handleFormChange";
import { generateEventTargetStructure } from "../../helpers/generateEventTargetStructure";

export const DropDown = ({
  settingsOrAutomation,
  data,
  state,
  stateSelector,
  operationSelector,
  subLocationSelector,
  setStateHook,
  availableChoices = null,
}) => {
  let arrayOfOptionElements,
    selectedOption = null;
  let dropdownID = "";
  let dropdownLabel = "";

  if (
    settingsOrAutomation === "settings" ||
    settingsOrAutomation === "automation"
  ) {
    [arrayOfOptionElements, selectedOption] = renderDropdownOptionsSettings(
      data,
      state
    );
    dropdownID = camelCasifyString(data.name);
    dropdownLabel = data.name;
  } else if (stateSelector) {
    arrayOfOptionElements = renderDropdownStates(data);
    dropdownID = data.state;
    dropdownLabel = "State";
  } else if (subLocationSelector) {
    arrayOfOptionElements = renderDropdownSublocations(data);
    dropdownID = data.subLocations;
    dropdownLabel = "Sublocations";
  } else if (operationSelector) {
  } else if (availableChoices !== null) {
    arrayOfOptionElements = availableChoices;
    dropdownID = camelCasifyString(data.name);
    dropdownLabel = data.name;
    selectedOption = arrayOfOptionElements[0].props.name;
  }

  /* 
    Use the statehook upon load
  */

  useEffect(() => {
    if (selectedOption !== null) {
      const e = generateEventTargetStructure(data.name, selectedOption);
      handleFormChange(e, setStateHook);
    }
  }, [data.name, setStateHook, selectedOption]);

  return (
    <div className="col col-6 mt-2">
      <label htmlFor={camelCasifyString(data.name)} className="col-form-label">
        {dropdownLabel}
      </label>

      <select
        className="form-select full-width-button brown-input"
        name={camelCasifyString(data.name)}
        aria-label={camelCasifyString(data.name)}
        id={dropdownID}
        defaultValue={selectedOption !== null ? selectedOption : null}
        onChange={(e) => {
          handleFormChange(e, setStateHook);
        }}
      >
        {arrayOfOptionElements}
      </select>
    </div>
  );
};
