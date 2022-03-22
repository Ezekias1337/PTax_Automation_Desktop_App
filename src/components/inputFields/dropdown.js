import { renderDropdownOptions } from "../../functions/renderDropdownOptions";
import { camelCasifyString } from "../../functions/camelCasifyString";

export const DropDown = (props) => {
  const [arrayOfOptionElements, selectedOption] = renderDropdownOptions(
    props.data,
    props.state
  );

  return (
    <div className="col col-6 mt-2">
      <label htmlFor={props.data.name} className="col-form-label">
        {props.data.name}
      </label>

      <select
        className="form-select full-width-button brown-input"
        aria-label={props.data.name}
        id={camelCasifyString(props.data.name)}
        defaultValue={selectedOption ? selectedOption : null}
      >
        {arrayOfOptionElements}
      </select>
    </div>
  );
};
