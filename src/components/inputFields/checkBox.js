export const CheckBox = (props) => {
  if (props.isChecked === true) {
    return (
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          value=""
          id="flexCheckDefault"
        ></input>
        <label class="form-check-label" for="flexCheckDefault">
          Default checkbox
        </label>
      </div>
    );
  } else if (props.isChecked === false) {
    return (
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          value=""
          id="flexCheckChecked"
          checked
        ></input>
        <label class="form-check-label" for="flexCheckChecked">
          Checked checkbox
        </label>
      </div>
    );
  }
};
