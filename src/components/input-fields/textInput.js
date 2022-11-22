// Library Imports
import { useEffect, useState } from "react";
// Functions, Helpers, Utils, and Hooks
import { inputFieldFillDefault } from "../../functions/forms/inputFieldFillDefault";
import { handleFormChange } from "../../functions/forms/handleFormChange";
import { generateEventTargetStructure } from "../../helpers/generateEventTargetStructure";
import { camelCasifyString } from "../../utils/strings/camelCasifyString";

export const TextInput = ({ data, state = null, setStateHook }) => {
  const [defaultValueProp, setDefaultValueProp] = useState(null);

  useEffect(() => {
    
    let tempValueProp = inputFieldFillDefault(
      data.name.split(" ").join(""),
      state,
      false,
      false
    );
    if (tempValueProp !== null) {
      setDefaultValueProp(tempValueProp);
    }
    
    
  }, [data.name, state]);

  useEffect(() => {
    if (defaultValueProp !== null) {
      const e = generateEventTargetStructure(data.name, defaultValueProp);
      handleFormChange(e, setStateHook);
    }
  }, [data.name, setStateHook, defaultValueProp]);

  return (
    <div className="col col-6 mt-2">
      <label htmlFor={camelCasifyString(data.name)} className="col-form-label">
        {data.name}
      </label>
      <input
        type={data.customInputType}
        className="form-control brown-input"
        name={camelCasifyString(data.name)}
        id={camelCasifyString(data.name)}
        placeholder={data?.placeholder}
        defaultValue={
          inputFieldFillDefault(
            data.name.split(" ").join(""),
            state,
            false,
            false
          )
            ? inputFieldFillDefault(
                data.name.split(" ").join(""),
                state,
                false,
                false
              )
            : ""
        }
        onChange={(e) => {
          handleFormChange(e, setStateHook);
        }}
      ></input>
    </div>
  );
};
