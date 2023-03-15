// Functions, Helpers, Utils
import { camelCasifyString } from "../../utils/strings/camelCasifyString";

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
      state?.settings?.contents[settingToCheckFor]?.toLowerCase()
    ) {
      return true;
    } else {
      return false;
    }
  } else if (isSwitch === true) {
    if (state?.settings.contents[settingToCheckFor] === true) {
      return true;
    } else {
      return false;
    }
  } else if (isDropDown === false) {
    const inputFieldCamelCasified = camelCasifyString(inputField);

    if (state?.settings?.contents[inputFieldCamelCasified] !== undefined) {
      return state.settings.contents[inputFieldCamelCasified];
    } else {
      return null;
    }
  }
};
