export const Switch = (props) => {
  if (props.isChecked === true) {
    return (
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id="flexSwitchCheckDefault"
        ></input>
        <label class="form-check-label" for="flexSwitchCheckDefault">
          Default switch checkbox input
        </label>
      </div>
    );
  } else if (props.isChecked === false) {
    return (
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id="flexSwitchCheckChecked"
          checked
        ></input>
        <label class="form-check-label" for="flexSwitchCheckChecked">
          Checked switch checkbox input
        </label>
      </div>
    );
  }
};
