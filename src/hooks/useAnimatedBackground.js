import { useLayoutEffect } from "react";
import { animateGradientBackground } from "../helpers/animateGradientBackground";

export const useAnimatedBackground = () => {
  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();
    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, []);
};
