export const handleFormChange = (e, setStateHook) => {
  setStateHook((prevState) => ({
    ...prevState,
    [e.target.name]: e.target.value,
  }));
};
