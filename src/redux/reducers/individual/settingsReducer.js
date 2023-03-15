// Action Types
import { SAVE_SETTINGS } from "../../actionCreators/settingsCreators";

const INITIAL_STATE = {
  contents: {
    colorTheme: "Gradient",
    screenResolution: "800x600",
    firstTimeRunning: true,
  },
};

const reducer = (state = INITIAL_STATE, action) => {
  let newStateObject;

  switch (action.type) {
    case SAVE_SETTINGS:
      newStateObject = {
        ...state,
      };
      const {
        colorTheme,
        screenResolution,
        launchWindowinCurrentPosition,
        launchWindowinCurrentPositionvalue,
        downloadDirectory,
        uploadDirectory,
        ptaxUsername,
        ptaxPassword,
        parcelQuestUsername,
        parcelQuestPassword,
        firstTimeRunning,
      } = action.payload;

      newStateObject.contents.colorTheme = colorTheme;
      newStateObject.contents.screenResolution = screenResolution;
      newStateObject.contents.launchWindowinCurrentPosition =
        launchWindowinCurrentPosition;
      newStateObject.contents.launchWindowinCurrentPositionvalue =
        launchWindowinCurrentPositionvalue;
      newStateObject.contents.downloadDirectory = downloadDirectory;
      newStateObject.contents.uploadDirectory = uploadDirectory;
      newStateObject.contents.ptaxUsername = ptaxUsername;
      newStateObject.contents.ptaxPassword = ptaxPassword;
      newStateObject.contents.parcelQuestUsername = parcelQuestUsername;
      newStateObject.contents.parcelQuestPassword = parcelQuestPassword;
      newStateObject.contents.firstTimeRunning = firstTimeRunning;

      return newStateObject;

    default:
      return state;
  }
};

export default reducer;
