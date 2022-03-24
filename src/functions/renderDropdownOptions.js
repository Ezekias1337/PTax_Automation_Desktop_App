import { inputFieldFillDefault } from "./inputFieldFillDefault";
import { camelCasifyString } from "./camelCasifyString";

export const renderDropdownOptions = (objToParse, state) => {
  console.log(objToParse, state)
  
  const arrayOfOptionElements = [];
  let selectedOption = false;
  for (const [index, nestedItem] of objToParse.options.entries()) {
    const isSelected = inputFieldFillDefault(nestedItem.choice, state, true, camelCasifyString(objToParse.name));

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
