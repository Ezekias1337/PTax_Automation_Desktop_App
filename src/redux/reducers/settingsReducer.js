const reducer = (
  state = {
    colorTheme: "gradient",
    screenResolution: "800x600",
    firstTimeRunning: true,
  },
  action
) => {
  switch (action.type) {
    case "save":
      return action.payload;
    default:
      return state;
  }
};

export default reducer;
