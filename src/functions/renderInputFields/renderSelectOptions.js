export const renderSelectOptions = (arrayOfOptions) => {
  const arrayOfInputFields = [];

  for (const option of arrayOfOptions) {
    arrayOfInputFields.push(
      <option
        value={option.name}
        key={option.key}
        name={option.name}
        id={`${option.name}-option`}
      >
        {option.name}
      </option>
    );
  }
  return arrayOfInputFields;
};
