import "./App.css";
import { HashRouter as Router, Route, Routes, Link } from "react-router-dom";
import { SelectAnAutomation } from "./components/selectAnAutomation";
import { Home } from "./components/home";
import React, { useState } from "react";
const { ipcRenderer, ipcMain } = window.require('electron');


const App = () => {
  /* const store = new Store();

  store.set("userSettings.theme", "dark"); */

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/select-an-automation"
          element={<SelectAnAutomation />}
        ></Route>
      </Routes>
    </Router>
  );
};

export default App;
