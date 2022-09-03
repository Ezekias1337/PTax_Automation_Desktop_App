import { listOfAutomationsArrayExport } from "../data/listOfAutomations";
import { Button } from "reactstrap";
import { HomeButton } from "./buttons/homeButton";
import { Link } from "react-router-dom";
import { animateGradientBackground } from "../functions/animateGradientBackground";
import { useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import "../css/vanilla_css/styles.css";
import "../css/vanilla_css/pre-operation-warnings-info.css";

export const PreOperationWarningsInfo = () => {
  const state = useSelector((state) => state);

  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();
    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, []);

  const arrayOfAutomations = [];

  for (const item of listOfAutomationsArrayExport) {
    arrayOfAutomations.push(
      <div key={item.key} className="col col-6 mt-3">
        <Link to={`/${item.name.split(" ").join("-").toLowerCase()}`}>
          <Button className="full-width-button styled-button">
            {item.name}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="container-fluid"
      data-theme={state.settings.colorTheme}
      id="element-to-animate"
    >
      <div className="row">{arrayOfAutomations}</div>
      <div className="row">
        <div className="col col-12 mt-5">
          <HomeButton />
        </div>
      </div>
    </div>
  );
};
