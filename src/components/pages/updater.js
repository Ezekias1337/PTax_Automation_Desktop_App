// Library Imports
import { useLayoutEffect } from "react";
import { useSelector } from "react-redux";
// Functions, Helpers, Utils, and Hooks
import { animateGradientBackground } from "../../helpers/animateGradientBackground";
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
// CSS
import "../../css/styles.scss";

export const Updater = () => {
  const state = useSelector((state) => state);
  useAnimatedBackground();

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
