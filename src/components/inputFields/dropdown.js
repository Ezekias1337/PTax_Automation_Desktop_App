import { useEffect } from "react";
import { renderDropdownOptionsSettings } from "../../functions/renderDropdownOptionsSettings";
import { renderDropdownStates } from "../../functions/renderDropdownStates";
import { renderDropdownSublocations } from "../../functions/renderDropdownSublocations";
import { renderDropdownOperations } from "../../functions/renderDropdownOperations";
import { camelCasifyString } from "../../functions/camelCasifyString";

export const DropDown = ({
  settingsOrAutomation,
  data,
  state,
  stateSelector,
  operationSelector,
  subLocationSelector,
  setStateHook = null,
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
  }

  
  /* 
    Set the statehook upon load
  */
 
  /* useEffect(() => {
    if(setStateHook !== null) {
      setStateHook(arrayOfOptionElements[0])
    }
  }, [setStateHook]) */
  
  return (
    <div className="col col-6 mt-2">
      <label htmlFor={dropdownLabel} className="col-form-label">
        {dropdownLabel}
      </label>

      <select
        className="form-select full-width-button brown-input"
        aria-label={data.name}
        id={dropdownID}
        defaultValue={selectedOption !== null ? selectedOption : null}
        onChange={
          setStateHook !== null ? (e) => setStateHook(e.target.value) : null
        }
      >
        {arrayOfOptionElements}
      </select>
    </div>
  );
};
