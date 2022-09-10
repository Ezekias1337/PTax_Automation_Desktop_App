export const renderDropdownSublocations = (arrayOfStates) => {
  const arrayOfOptionElements = [];

  for (const item of arrayOfStates) {
    arrayOfOptionElements.push(
      <option
        value={item.name}
        key={item.key}
        name={item.name}
        id={`${item.name}-option`}
      >
        {item.name}
      </option>
    );
  }
  return arrayOfOptionElements;
};
