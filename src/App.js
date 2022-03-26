import "./App.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { SelectAnAutomation } from "./components/selectAnAutomation";
import { Home } from "./components/home";
import { Settings } from "./components/settings";
import { Automation } from "./components/automation";
import React from "react";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/select-an-automation"
          element={<SelectAnAutomation />}
        ></Route>
        <Route path="/settings" element={<Settings />}></Route>
        <Route
          path="/assessment-notices"
          element={<Automation pageTitle="Assessment Notices" />}
        ></Route>

        <Route
          path="/change-mailing-address"
          element={<Automation pageTitle="Change Mailing Address" />}
        ></Route>
        <Route
          path="/check-requests"
          element={<Automation pageTitle="Check Requests" />}
        ></Route>
        <Route
          path="/payment-confirmations"
          element={<Automation pageTitle="Payment Confirmations" />}
        ></Route>
        <Route
          path="/property-point-of-contact"
          element={<Automation pageTitle="Property Point of Contact" />}
        ></Route>
        <Route
          path="/property-tax-bills"
          element={<Automation pageTitle="Property Tax Bills" />}
        ></Route>
        <Route
          path="/add-new-parcels"
          element={<Automation pageTitle="Add New Parcels" />}
        ></Route>
        <Route
          path="/update-parcel-names"
          element={<Automation pageTitle="Update Parcel Names" />}
        ></Route>
        <Route
          path="/check-assessor-and-collector-links"
          element={
            <Automation pageTitle="Check Assessor and Collector Links" />
          }
        ></Route>
        <Route
          path="/pull-parcel-information-from-realquest"
          element={
            <Automation pageTitle="Pull Parcel Information From Realquest" />
          }
        ></Route>
      </Routes>
    </Router>
  );
};

export default App;
