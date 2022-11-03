// Library Imports
import { useLayoutEffect } from "react";
import { useSelector } from "react-redux";
// Functions, Helpers, Utils, and Hooks
import { animateGradientBackground } from "../../helpers/animateGradientBackground";
// Components
import { TitleBar } from "../general-page-layout/titlebar";
import { Header } from "../general-page-layout/header";
// CSS
import "../../css/sass_css/styles.scss";

export const PostAutomationSummary = () => {
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
    >
      <TitleBar />

      <div className="container-for-scroll">
        <Header pageTitle="Post Automation Summary" includeArrow={true} />
        <div className="row mx-1"></div>
      </div>
    </div>
  );
};
