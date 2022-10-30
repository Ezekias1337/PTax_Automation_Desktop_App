import { inputFieldFillDefault } from "./inputFieldFillDefault";
import { camelCasifyString } from "../../utils/strings/camelCasifyString";

export const renderDropdownOptionsSettings = (objToParse, state) => {
  const arrayOfOptionElements = [];
  let selectedOption = false;

  for (const [index, nestedItem] of objToParse.options.entries()) {
    const isSelected = inputFieldFillDefault(
      nestedItem.choice,
      state,
      true,
      false,
      camelCasifyString(objToParse.name)
    );

    if (isSelected === true) {
      arrayOfOptionElements.push(
        <option
          value={nestedItem.choice}
          key={nestedItem.key}
          name={nestedItem.choice}
        >
          {nestedItem.choice}
        </option>
      );
      selectedOption = nestedItem.choice;
    } else {
      arrayOfOptionElements.push(
        <option
          value={nestedItem.choice}
          key={nestedItem.key}
          name={nestedItem.choice}
        >
          {nestedItem.choice}
        </option>
      );
    }
  }
  return [arrayOfOptionElements, selectedOption];
};
