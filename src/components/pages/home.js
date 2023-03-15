// Library Imports
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
// Functions, Helpers, Utils and Hooks
import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useIsFirstTimeRunning } from "../../hooks/useIsFirstTimeRunning";
import { useResetRedux } from "../../hooks/useResetRedux";
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
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
import { useEffect } from "react";

export const Home = () => {
  const isFirstTimeRunning = useIsFirstTimeRunning();
  usePersistentSettings();
  useResetRedux();
  useAnimatedBackground();
  const state = useSelector((state) => state);
  const { backgroundPositionX, backgroundPositionY, animationName } =
    state.animatedBackground.contents;

  useEffect(() => {
    console.log("animationName: ", animationName);
  }, [animationName]);

  return (
    <div
      className="home-page"
      id="element-to-animate"
      data-theme={
        state.settings.contents.colorTheme !== undefined
          ? state.settings.contents.colorTheme
          : "Gradient"
      }
      data-animation-name={animationName}
      style={{
        backgroundPositionX: backgroundPositionX,
        backgroundPositionY: backgroundPositionY,
      }}
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
        </div>
      </header>
    </div>
  );
};
