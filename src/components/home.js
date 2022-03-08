import logo from "../../src/images/PTax_Logo.png";
import "../App.css";
import "../css/vanilla_css/styles.css";
import "../css/vanilla_css/home.css"
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import React, { useLayoutEffect } from "react";
import { HomeFunction } from "../functions/homeFunctions";
import { SettingsButton } from "./buttons/settingsButton";

export const Home = () => {
  useLayoutEffect(() => {
    const backgroundInterval = HomeFunction();
    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  });

  return (
    <div className="Home" data-theme="dark">
      <header className="App-header home-body">
        <img src={logo} className="App-logo mb-5" alt="logo" />
        <div className="container">
          <div className="row">
          <div className="col col-3"></div>
            <div className="col col-3">
              <Link to={"/select-an-automation"}>
                <Button className="full-width-button brown-button">
                  Select an Automation
                </Button>
              </Link>
            </div>
            <div className="col col-3">
              <SettingsButton></SettingsButton>
            </div>
            <div className="col col-3"></div>
          </div>
        </div>
      </header>
    </div>
  );
};
