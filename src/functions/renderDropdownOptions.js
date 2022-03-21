import { inputFieldFillDefault } from "./inputFieldFillDefault";

export const renderDropdownOptions = (objToParse, state) => {
  const arrayOfOptionElements = [];
  let selectedOption = false;
  for (const [index, nestedItem] of objToParse.options.entries()) {
    const isSelected = inputFieldFillDefault(nestedItem.choice, state, true);

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
