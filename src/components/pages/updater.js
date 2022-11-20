// Library Imports
import { useLayoutEffect } from "react";
import { useSelector } from "react-redux";
// Functions, Helpers, Utils, and Hooks
import { animateGradientBackground } from "../../helpers/animateGradientBackground";
// CSS
import "../../css/styles.scss";

export const Updater = () => {
  const state = useSelector((state) => state);

  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();
    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, []);

  return (
    <div
      data-theme={
        state.settings.colorTheme !== undefined
          ? state.settings.colorTheme
          : "Gradient"
      }
      id="element-to-animate"
    ></div>
  );
};