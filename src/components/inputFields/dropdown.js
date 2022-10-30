import { useEffect } from "react";
import { renderDropdownOptionsSettings } from "../../functions/forms/renderDropdownOptionsSettings";
import { camelCasifyString } from "../../utils/strings/camelCasifyString";
import { handleFormChange } from "../../functions/forms/handleFormChange";
import { generateEventTargetStructure } from "../../helpers/generateEventTargetStructure";

export const DropDown = ({
  isSettingsDropdown,
  data,
  state,
  setStateHook,
  availableChoices = null,
}) => {
  let arrayOfOptionElements,
    selectedOption = null;
  let dropdownID = "";
  let dropdownLabel = "";

  if (isSettingsDropdown === true) {
    [arrayOfOptionElements, selectedOption] = renderDropdownOptionsSettings(
      data,
      state
    );
    dropdownID = camelCasifyString(data.name);
    dropdownLabel = data.name;
  } else if(availableChoices !== null) {
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
