// Library Imports
import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
// Constants
import { addNewParcelsQuestions } from "./constants/automation-questions/addNewParcelsQuestions";
import { assessmentNoticesQuestions } from "./constants/automation-questions/assessmentNoticesQuestions";
import { checkAssessorAndCollectorUrlsQuestions } from "./constants/automation-questions/checkAssessorAndCollectorUrlsQuestions";
import { paymentConfirmationsQuestions } from "./constants/automation-questions/paymentConfirmationsQuestions";
import { propertyPointOfContactQuestions } from "./constants/automation-questions/propertyPointOfContactQuestions";
import { propertyTaxBillsQuestions } from "./constants/automation-questions/propertyTaxBillsQuestions";
import { updateParcelNamesQuestions } from "./constants/automation-questions/updateParcelNamesQuestions";
// Components
import { Home } from "./components/pages/home";
import { SelectAnAutomation } from "./components/pages/selectAnAutomation";
import { Settings } from "./components/pages/settings";
import { PreAutomationConfig } from "./components/pages/preAutomationConfig";
import { Automation } from "./components/pages/automation";
import { PostAutomationSummary } from "./components/pages/postAutomationSummary";
import { SpreadsheetTemplateViewer } from "./components/pages/spreadsheetTemplateViewer";

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
          path="/spreadsheet-templates"
          element={<SpreadsheetTemplateViewer />}
        ></Route>
        {/* Routes that use the Automation component */}
        <Route
          path="/add-new-parcels"
          element={
            <Automation
              automationName="Add New Parcels"
              preOperationQuestions={addNewParcelsQuestions}
            />
          }
        ></Route>
        <Route
          path="/assessment-notices"
          element={
            <Automation
              automationName="Assessment Notices"
              preOperationQuestions={assessmentNoticesQuestions}
            />
          }
        ></Route>
        <Route
          path="/check-assessor-and-collector-urls"
          element={
            <Automation
              automationName="Check Assessor And Collector Urls"
              preOperationQuestions={checkAssessorAndCollectorUrlsQuestions}
            />
          }
        ></Route>
        <Route
          path="/payment-confirmations"
          element={
            <Automation
              automationName="Payment Confirmations"
              preOperationQuestions={paymentConfirmationsQuestions /*  */}
            />
          }
        ></Route>
        <Route
          path="/property-point-of-contact"
          element={
            <Automation
              automationName="Property Point of Contact"
              preOperationQuestions={propertyPointOfContactQuestions}
            />
          }
        ></Route>
        <Route
          path="/property-tax-bills"
          element={
            <Automation
              automationName="Property Tax Bills"
              preOperationQuestions={propertyTaxBillsQuestions}
            />
          }
        ></Route>

        <Route
          path="/update-parcel-names"
          element={
            <Automation
              automationName="Update Parcel Names"
              preOperationQuestions={updateParcelNamesQuestions}
            />
          }
        ></Route>
        {/* End of Routes that use the Automation component */}
        <Route
          path="/post-automation-summary"
          element={<PostAutomationSummary />}
        ></Route>
      </Routes>
    </Router>
  );
};

export default App;
