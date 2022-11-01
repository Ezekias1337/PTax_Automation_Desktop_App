// Functions, Helpers, Utils, and Hooks
import { handleFormChange } from "../../functions/forms/handleFormChange";
import { camelCasifyString } from "../../utils/strings/camelCasifyString";

export const CheckBox = ({ data, isChecked, setStateHook }) => {
  if (isChecked === true) {
    return (
      <div className="form-check">
        <input
          className="form-check-input"
          name={data.name}
          type="checkbox"
          value=""
          id="flexCheckDefault"
          onChange={(e) => {
            handleFormChange(e, setStateHook);
          }}
        ></input>
        <label
          className="form-check-label"
          htmlFor={camelCasifyString(data.name)}
        >
          Default checkbox
        </label>
      </div>
    );
  } else if (isChecked === false) {
    return (
      <div className="form-check">
        <input
          className="form-check-input"
          name={data.name}
          type="checkbox"
          value=""
          id="flexCheckChecked"
          onChange={(e) => {
            handleFormChange(e, setStateHook);
          }}
          checked
        ></input>
        <label
          className="form-check-label"
          htmlFor={camelCasifyString(data.name)}
        >
          Checked checkbox
        </label>
      </div>
    );
  }
};
