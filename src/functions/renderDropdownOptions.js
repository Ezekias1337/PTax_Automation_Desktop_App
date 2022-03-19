export const renderDropdownOptions = (objToParse) => {
  const arrayOfOptionElements = [];
  for (const [index, nestedItem] of objToParse.options.entries()) {
    arrayOfOptionElements.push(
      <option value={index} key={nestedItem.key}>
        {nestedItem.choice}
      </option>
    );
  }
  return arrayOfOptionElements;
};
