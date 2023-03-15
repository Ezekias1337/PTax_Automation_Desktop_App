// Constants
const typeBase = "settings/";
// Action Types
export const SAVE_SETTINGS = `${typeBase}SAVE_SETTINGS`;

export const saveSettings = (settings) => {
  return (dispatch) => {
    dispatch({
      type: SAVE_SETTINGS,
      payload: settings,
    });
  };
};
