import { camelCasifyString } from "../utils/camelCasifyString";

export const inputFieldFillDefault = (
  inputField,
  state,
  isDropDown,
  isSwitch,
  settingToCheckFor
) => {
  if (isDropDown === true) {
    if (
      inputField?.toLowerCase() ===
      state?.settings[settingToCheckFor]?.toLowerCase()
    ) {
      return true;
    } else {
      return false;
    }
  } else if (isSwitch === true) {
    if (state?.settings[settingToCheckFor] === true) {
      return true;
    } else {
      return false;
    }
  } else if (isDropDown === false) {
    const inputFieldCamelCasified = camelCasifyString(inputField);
    if (state.settings[inputFieldCamelCasified] !== undefined) {
      return state.settings[inputFieldCamelCasified];
    } else {
      return null;
    }
  }
};
