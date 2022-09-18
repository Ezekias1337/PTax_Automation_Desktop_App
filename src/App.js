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
          element={
            <Automation
              automationName="Assessment Notices"
              preOperationQuestions={[
                {
                  key: 0,
                  name: "State",
                  parentQuestion: null,
                  inputType: "Dropdown",
                },
                {
                  key: 1,
                  name: "Sublocation",
                  parentQuestion: "State",
                  inputType: "Dropdown",
                },
                {
                  key: 2,
                  name: "Operation",
                  parentQuestion: "Sublocation",
                  inputType: "Dropdown",
                },
                {
                  key: 3,
                  name: "Installment Number",
                  parentQuestion: "Operation",
                  inputType: "Dropdown",
                },
                {
                  key: 4,
                  name: "Upload Directory",
                  parentQuestion: "Operation",
                  inputType: "File",
                },
                {
                  key: 5,
                  name: "Download Directory",
                  parentQuestion: "Operation",
                  inputType: "Directory",
                },
              ]}
            />
          }
        ></Route>

        <Route
          path="/change-mailing-address"
          element={
            <Automation
              automationName="Change Mailing Address"
              preOperationQuestions={[]}
            />
          }
        ></Route>
        <Route
          path="/check-requests"
          element={
            <Automation
              automationName="Check Requests"
              preOperationQuestions={[]}
            />
          }
        ></Route>
        <Route
          path="/payment-confirmations"
          element={
            <Automation
              automationName="Payment Confirmations"
              preOperationQuestions={[]}
            />
          }
        ></Route>
        <Route
          path="/property-point-of-contact"
          element={
            <Automation
              automationName="Property Point of Contact"
              preOperationQuestions={[]}
            />
          }
        ></Route>
        <Route
          path="/property-tax-bills"
          element={
            <Automation
              automationName="Property Tax Bills"
              preOperationQuestions={[]}
            />
          }
        ></Route>
        <Route
          path="/add-new-parcels"
          element={
            <Automation
              automationName="Add New Parcels"
              preOperationQuestions={[]}
            />
          }
        ></Route>
        <Route
          path="/update-parcel-names"
          element={
            <Automation
              automationName="Update Parcel Names"
              preOperationQuestions={[]}
            />
          }
        ></Route>
        <Route
          path="/check-assessor-and-collector-links"
          element={
            <Automation
              automationName="Check Assessor and Collector Links"
              preOperationQuestions={[]}
            />
          }
        ></Route>
        <Route
          path="/pull-parcel-information-from-realquest"
          element={
            <Automation
              automationName="Pull Parcel Information From Realquest"
              preOperationQuestions={[]}
            />
          }
        ></Route>
      </Routes>
    </Router>
  );
};

export default App;
