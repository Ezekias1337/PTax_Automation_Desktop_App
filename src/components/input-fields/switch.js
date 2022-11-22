// Library Imports
import { useEffect, useState } from "react";
// Functions, Helpers, Utils, and Hooks
import { inputFieldFillDefault } from "../../functions/forms/inputFieldFillDefault";
import { handleFormChange } from "../../functions/forms/handleFormChange";
import { generateEventTargetStructure } from "../../helpers/generateEventTargetStructure";
import { camelCasifyString } from "../../utils/strings/camelCasifyString";

export const Switch = ({ data, state = null, setStateHook = null }) => {
  const [isChecked, setIsChecked] = useState(false);

  /* 
    Prepare default value for input field if it exists
  */

  useEffect(() => {
    const isCheckedHelper = camelCasifyString(data.name.split(" ").join(""));
    const isCheckedTemp = inputFieldFillDefault(
      data.name.split(" ").join(""),
      state,
      false,
      true,
      isCheckedHelper
    );

    setIsChecked(isCheckedTemp);

    /* 
      Ensure the parent components form data state is updated if the 
      default input value from electron-store is different from what is 
      defined in useState's default
    */

    const e = generateEventTargetStructure(data.name, isCheckedTemp);
    handleFormChange(e, setStateHook);
  }, [data.name, setStateHook, state]);

  return (
    <div className="col col-6 mt-2">
      <div className="form-check form-switch row">
        <label
          htmlFor={camelCasifyString(data.name)}
          className="col-form-label"
        >
          {data.name}
        </label>
        <div>
          <input
            className="form-check-input brown-input"
            name={data.name}
            type="checkbox"
            aria-label={data.name}
            id={camelCasifyString(data.name)}
            checked={isChecked}
            onChange={() => {
              const e = generateEventTargetStructure(data.name, !isChecked);
              handleFormChange(e, setStateHook);
              setIsChecked(!isChecked);
            }}
          ></input>
        </div>
      </div>
    </div>
  );
};
