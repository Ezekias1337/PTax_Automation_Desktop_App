// Library Imports
import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
// Constants
import { assessmentNoticeQuestions } from "./constants/automation-questions/assessmentNoticeQuestions";
import { taxBillQuestions } from "./constants/automation-questions/taxBillQuestions";
// Components
import { Home } from "./components/pages/home";
import { SelectAnAutomation } from "./components/pages/selectAnAutomation";
import { Settings } from "./components/pages/settings";
import { PreAutomationConfig } from "./components/pages/preAutomationConfig";
import { Automation } from "./components/pages/automation";
import { PostAutomationSummary } from "./components/pages/postAutomationSummary";
// CSS
import "./App.css";

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
              preOperationQuestions={assessmentNoticeQuestions}
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
              preOperationQuestions={taxBillQuestions}
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
        <Route
          path="/post-automation-summary"
          element={<PostAutomationSummary />}
        ></Route>
      </Routes>
    </Router>
  );
};

export default App;
