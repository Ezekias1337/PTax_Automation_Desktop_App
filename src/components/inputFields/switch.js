import { camelCasifyString } from "../../functions/camelCasifyString";

export const Switch = (props) => {
  if (props.isChecked === true) {
    return (
      <div class="col col-6 mt-2">
        <div class="form-check form-switch row">
          <div class="col col-12">
            <label htmlFor={props.data.name} className="col-form-label">
              {props.data.name}
            </label>
          </div>
          <div class="col col-12">
            <input
              class="form-check-input"
              name={props.data.name}
              type="checkbox"
              aria-label={props.data.name}
              id={camelCasifyString(props.data.name)}
              checked
            ></input>
          </div>
        </div>
      </div>
    );
  } else if (props.isChecked === false) {
    return (
      <div class="col col-6 mt-2">
        <div class="form-check form-switch row">
          <div class="col col-12">
            <label htmlFor={props.data.name} className="col-form-label">
              {props.data.name}
            </label>
          </div>
          <div class="col col-12">
            <input
              class="form-check-input"
              name={props.data.name}
              type="checkbox"
              aria-label={props.data.name}
              id={camelCasifyString(props.data.name)}
            ></input>
          </div>
        </div>
      </div>
    );
  }
};
