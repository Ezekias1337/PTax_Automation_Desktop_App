import { inputFieldFillDefault } from "../../functions/inputFieldFillDefault";

export const TextInput = (props) => {
  return (
    <div className="col col-6 mt-2">
      <label htmlFor={props.data.name} className="col-form-label">
        {props.data.name}
      </label>
      <input
        type={props.data.customInputType}
        className="form-control brown-input"
        name={props.data.name}
        id={props.data.name.split(" ").join("")}
        placeholder={props?.data?.placeholder}
        defaultValue={
          inputFieldFillDefault(
            props.data.name.split(" ").join(""),
            props.state,
            false,
            false
          )
            ? inputFieldFillDefault(
                props.data.name.split(" ").join(""),
                props.state,
                false,
                false
              )
            : ""
        }
      ></input>
    </div>
  );
};
