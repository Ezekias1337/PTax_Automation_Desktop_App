export const renderDropdownStates = (arrayOfStates) => {
  const arrayOfOptionElements = [];

  for (const item of arrayOfStates) {
    arrayOfOptionElements.push(
      <option
        value={item.state}
        key={item.key}
        name={item.state}
        id={`${item.state}-option`}
      >
        {item.state}
      </option>
    );
  }
  return arrayOfOptionElements;
};
