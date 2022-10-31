import { TitleBar } from "../general-page-layout/titlebar";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { useLayoutEffect } from "react";
import { animateGradientBackground } from "../../helpers/animateGradientBackground";
import { SettingsButton } from "../buttons/settingsButton";
import { useSelector } from "react-redux";
import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useIsFirstTimeRunning } from "../../hooks/useIsFirstTimeRunning";
import { GeneralAlert } from "../alert/generalAlert";
import logo from "../../../src/images/PTax_Logo.png";
import "../../App.css";
import "../../css/sass_css/styles.scss";
import "../../css/sass_css/home.scss";

export const Home = () => {
  const isFirstTimeRunning = useIsFirstTimeRunning();
  usePersistentSettings();
  const state = useSelector((state) => state);

  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();
    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, []);

  return (
    <div
      className="home"
      id="element-to-animate"
      data-theme={
        state.settings.colorTheme !== undefined
          ? state.settings.colorTheme
          : "Gradient"
      }
    >
      <TitleBar />
      <header className="App-header home-body">
        <img src={logo} className="App-logo mb-5" alt="logo" />
        <div className="container">
          <div className="row">
            <div className="col col-12 col-lg-3"></div>
            <div className="col col-6 col-lg-3">
              <Link to={"/select-an-automation"}>
                <Button className="full-width-button styled-button">
                  Select an Automation
                </Button>
              </Link>
            </div>
            <div className="col col-6 col-lg-3">
              <SettingsButton isAnimated={isFirstTimeRunning}></SettingsButton>
            </div>
            <div className="col col-12 col-lg-3"></div>
          </div>
          <GeneralAlert
            isVisible={isFirstTimeRunning}
            string="&nbsp;Looks like this is your first time running this application.
            Click on the flashing settings button above to get started."
            colorClassName="alert-info"
          ></GeneralAlert>
        </div>
      </header>
    </div>
  );
};
