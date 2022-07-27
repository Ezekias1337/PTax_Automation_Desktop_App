import { renderDropdownOptionsSettings } from "../../functions/renderDropdownOptionsSettings";
import { renderDropdownOperations } from "../../functions/renderDropdownOperations";
import { renderDropdownStates } from "../../functions/renderDropdownStates";
import { camelCasifyString } from "../../functions/camelCasifyString";

export const DropDown = (props) => {
  let arrayOfOptionElements,
    selectedOption = null;
  let dropdownID = "";
  let dropdownLabel = "";

  if (
    props?.settingsOrAutomation === "settings" ||
    props?.settingsOrAutomation === "automation"
  ) {
    [arrayOfOptionElements, selectedOption] = renderDropdownOptionsSettings(
      props.data,
      props.state
    );
    dropdownID = camelCasifyString(props.data.name);
    dropdownLabel = props.data.name;
  } else if (props?.stateSelector) {
    arrayOfOptionElements = renderDropdownStates(props.data);
    dropdownID = props.data.state;
    dropdownLabel = "State"
  } else if (props?.operationSelector) {
  } else if (props?.subLocationSelector) {
  }

  return (
    <div className="col col-6 mt-2">
      <label htmlFor={dropdownLabel} className="col-form-label">
        {dropdownLabel}
      </label>

      <select
        className="form-select full-width-button brown-input"
        aria-label={props.data.name}
        id={dropdownID}
        defaultValue={selectedOption !== null ? selectedOption : null}
      >
        {arrayOfOptionElements}
      </select>
    </div>
  );
};
