import logo from "../../src/images/PTax_Logo.png";
import "../App.css";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useLayoutEffect } from "react";
import { HomeFunction } from "../functions/homeFunctions";

export const Home = () => {
  
  useLayoutEffect(() => {
    HomeFunction();
  });
  
  return (
    <div className="Home">
      <header className="App-header home-body">
        <img src={logo} className="App-logo" alt="logo" />
        <Link to={"/select-an-automation"}>
          <Button className="mt-5">Start Automation</Button>
        </Link>

        <Link to={"/settings"}>
          <Button className="mt-3">
            <FontAwesomeIcon icon={faGear} />
          </Button>
        </Link>
      </header>
    </div>
  );
};
