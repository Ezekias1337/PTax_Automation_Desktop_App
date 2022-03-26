import "../css/vanilla_css/styles.css";
import "../css/vanilla_css/select-an-automation.css";
import { HomeButton } from "./buttons/homeButton";
import { BackButton } from "./buttons/backButton";
import { animateGradientBackground } from "../functions/animateGradientBackground";
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EventLog } from "./eventLog";

export const Automation = (props) => {
  const state = useSelector((state) => state);

  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();
    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, []);

  return (
    <div
      className="Automation container-fluid"
      id="element-to-animate"
      data-theme={state.settings.colorTheme}
    >
      <div className="row page-title">
        <h1>{props.pageTitle}</h1>
      </div>
      <div className="row">
        <div className="col col-6 mt-1"> </div>
        <div className="col col-6 mt-1">
          <EventLog></EventLog>
        </div>
      </div>
      <div className="row">
        <div className="col col-12 mt-5">
          <BackButton></BackButton>
          <HomeButton></HomeButton>
        </div>
      </div>
    </div>
  );
};
