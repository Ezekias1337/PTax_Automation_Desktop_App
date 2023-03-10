// Library Imports
import { useLayoutEffect } from "react";
// Functions, Helpers, Utils
import { animateGradientBackground } from "../helpers/animateGradientBackground";

export const useAnimatedBackground = () => {
  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();
    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, []);
};
