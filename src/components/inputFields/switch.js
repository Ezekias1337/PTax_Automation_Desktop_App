import { camelCasifyString } from "../../functions/camelCasifyString";
import { inputFieldFillDefault } from "../../functions/inputFieldFillDefault";

export const Switch = (props) => {
  const isChecked = inputFieldFillDefault(
    props.data.name.split(" ").join(""),
    props.state,
    false,
    true
  );

  return (
    <div className="col col-6 mt-2">
      <div className="form-check form-switch row">
        <div className="col col-12">
          <label htmlFor={props.data.name} className="col-form-label">
            {props.data.name}
          </label>
        </div>
        <div className="col col-12">
          <input
            className="form-check-input brown-input"
            name={props.data.name}
            type="checkbox"
            aria-label={props.data.name}
            id={camelCasifyString(props.data.name)}
            defaultChecked={isChecked ? true : false}
          ></input>
        </div>
      </div>
    </div>
  );
};
