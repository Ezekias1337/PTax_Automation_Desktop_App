export const inputFieldFillDefault = (inputField, state, isDropDown, settingToCheckFor="colorTheme") => {
  if (isDropDown === true) {
    if(inputField.toLowerCase() === state.settings[settingToCheckFor].toLowerCase()) {
        return true
    } else {
        return false
    }
  } else if (isDropDown === false) {
    console.log(inputField, state)
  }
};
