// Library Imports
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// Functions, Helpers, Utils and Hooks
import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useIsFirstTimeRunning } from "../../hooks/useIsFirstTimeRunning";
import { useResetRedux } from "../../hooks/useResetRedux";
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
// Constants
import packageInfo from "../../../package.json";
// Components
import { TitleBar } from "../general-page-layout/titlebar";
import { SettingsButton } from "../buttons/settingsButton";
import { GeneralAlert } from "../alert/generalAlert";
// CSS
import "../../App.css";
import "../../css/styles.scss";
import "../../css/home.scss";
// Assets and Images
import logo from "../../../src/images/PTax_Logo.png";

export const Home = () => {
  const isFirstTimeRunning = useIsFirstTimeRunning();
  usePersistentSettings();
  useResetRedux();
  useAnimatedBackground();
  const [animationParent] = useAutoAnimate();
  const state = useSelector((state) => state);

  return (
    <div
      className="home-page"
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
            <div className="col col-12 col-md-4">
              <Link to={"/select-an-automation"}>
                <Button className="full-width-button styled-button">
                  Select Automation
                </Button>
              </Link>
            </div>
            <div className="col col-12 col-md-4">
              <Link to={"/spreadsheet-templates"}>
                <Button className="full-width-button styled-button">
                  Spreadsheet Templates
                </Button>
              </Link>
            </div>
            <div className="col col-12 col-md-4">
              <SettingsButton isAnimated={isFirstTimeRunning}></SettingsButton>
            </div>
          </div>
          <GeneralAlert
            isVisible={isFirstTimeRunning}
            colorClassName="info"
            alertText="&nbsp;Looks like this is your first time running this application.
            Click on the flashing settings button above to get started."
          ></GeneralAlert>
          <div className="row mt-5">
            <div className="col col-12 col-md-2"></div>
            <div
              id="versionNumberWrapper"
              className="col col-12 col-md-8 full-flex"
              ref={animationParent}
            >
              <span>Version: {packageInfo.version}</span>
            </div>
            <div className="col col-12 col-md-2"></div>
          </div>
        </div>
      </header>
    </div>
  );
};
