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
          element={<Automation automationName="Assessment Notices" />}
        ></Route>

        <Route
          path="/change-mailing-address"
          element={<Automation automationName="Change Mailing Address" />}
        ></Route>
        <Route
          path="/check-requests"
          element={<Automation automationName="Check Requests" />}
        ></Route>
        <Route
          path="/payment-confirmations"
          element={<Automation automationName="Payment Confirmations" />}
        ></Route>
        <Route
          path="/property-point-of-contact"
          element={<Automation automationName="Property Point of Contact" />}
        ></Route>
        <Route
          path="/property-tax-bills"
          element={<Automation automationName="Property Tax Bills" />}
        ></Route>
        <Route
          path="/add-new-parcels"
          element={<Automation automationName="Add New Parcels" />}
        ></Route>
        <Route
          path="/update-parcel-names"
          element={<Automation automationName="Update Parcel Names" />}
        ></Route>
        <Route
          path="/check-assessor-and-collector-links"
          element={
            <Automation automationName="Check Assessor and Collector Links" />
          }
        ></Route>
        <Route
          path="/pull-parcel-information-from-realquest"
          element={
            <Automation automationName="Pull Parcel Information From Realquest" />
          }
        ></Route>
      </Routes>
    </Router>
  );
};

export default App;
