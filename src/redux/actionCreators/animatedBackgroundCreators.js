// Constants
const typeBase = "animatedBackground/";
// Action Types
export const UPDATE_BACKGROUND = `${typeBase}UPDATE_BACKGROUND`;

export const updateBackground = (backgroundPosition) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_BACKGROUND,
      payload: backgroundPosition,
    });
  };
};
