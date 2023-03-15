// Action Types
import { UPDATE_BACKGROUND } from "../../actionCreators/animatedBackgroundCreators";

const INITIAL_STATE = {
  contents: {
    backgroundPositionX: "50%",
    backgroundPositionY: "50%",
  },
};

const reducer = (state = INITIAL_STATE, action) => {
  let newStateObject;

  switch (action.type) {
    case UPDATE_BACKGROUND:
      newStateObject = {
        ...state,
      };
      const { backgroundPositionX, backgroundPositionY, animationName } =
        action.payload;

      newStateObject.contents.backgroundPositionX = backgroundPositionX;
      newStateObject.contents.backgroundPositionY = backgroundPositionY;
      newStateObject.contents.animationName = animationName;

      return newStateObject;

    default:
      return state;
  }
};

export default reducer;
