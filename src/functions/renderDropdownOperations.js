import { inputFieldFillDefault } from "./inputFieldFillDefault";
import { camelCasifyString } from "./camelCasifyString";

export const renderDropdownOperations = (arrayToParse, state) => {
  const arrayOfOptionElements = [];
  let selectedOption = false;
  for (const item of arrayToParse) {
    const isSelected = inputFieldFillDefault(
      item.choice,
      state,
      true,
      false,
      camelCasifyString(arrayToParse.name)
    );

    arrayOfOptionElements.push(
      <option value={item.choice} key={item.key} name={item.choice}>
        {item.choice}
      </option>
    );

    if (isSelected === true) {
      selectedOption = item.choice;
    }
  }
  return [arrayOfOptionElements, selectedOption];
};
