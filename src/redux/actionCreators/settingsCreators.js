export const saveSettings = (settings) => {
  return (dispatch) => {
    dispatch({
      type: "save",
      payload: settings,
    });
  };
};
