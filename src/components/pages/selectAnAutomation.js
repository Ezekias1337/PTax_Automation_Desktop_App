import { TitleBar } from "../general-page-layout/titlebar";
import { Header } from "../general-page-layout/header";
import { listOfAutomationsArrayExport } from "../../constants/listOfAutomations";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { animateGradientBackground } from "../../helpers/animateGradientBackground";
import { useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import "../../css/sass_css/styles.scss";

export const SelectAnAutomation = () => {
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
      data-theme={
        state.settings.colorTheme !== undefined
          ? state.settings.colorTheme
          : "Gradient"
      }
      id="element-to-animate"
    >
      <TitleBar />

      <div className="container-for-scroll">
        <Header pageTitle="Select an Automation" includeArrow={false} />
        <div className="row mx-1">{arrayOfAutomations}</div>
      </div>
    </div>
  );
};
