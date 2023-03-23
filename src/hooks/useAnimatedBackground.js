// Library Imports
import { useLayoutEffect } from "react";
// Functions, Helpers, Utils
import { animateGradientBackground } from "../helpers/animateGradientBackground";

/* 
  ? I tried to refactor this to use hooks to be more inline with
  ? React best practices, but I couldn't figure out a way to make
  ? it not re-render the entire component every 5 seconds, so I 
  ? reverted it to this, although it's not ideal.
*/

export const useAnimatedBackground = () => {
  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();
    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, []);
};
