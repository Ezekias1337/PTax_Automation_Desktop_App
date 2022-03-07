import logo from "../../src/images/PTax_Logo.png";
import "../App.css";
import "../css/vanilla_css/styles.css";
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
    <div className="Home">
      <header className="App-header home-body">
        <img src={logo} className="App-logo" alt="logo" />
        <Link to={"/select-an-automation"}>
          <Button className="mt-5">Start Automation</Button>
        </Link>
        <SettingsButton></SettingsButton>
      </header>
    </div>
  );
};
