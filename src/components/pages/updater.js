// Library Imports
import { useSelector } from "react-redux";
// Functions, Helpers, Utils, and Hooks
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
// CSS
import "../../css/styles.scss";

export const Updater = () => {
  const state = useSelector((state) => state);
  const { backgroundPositionX, backgroundPositionY, animationName } =
    state.animatedBackground.contents;
  useAnimatedBackground();

  return (
    <div
      id="element-to-animate"
      data-theme={
        state.settings.contents.colorTheme !== undefined
          ? state.settings.contents.colorTheme
          : "Gradient"
      }
      data-animation-name={animationName}
      style={{
        backgroundPositionX: backgroundPositionX,
        backgroundPositionY: backgroundPositionY,
      }}
    ></div>
  );
};
