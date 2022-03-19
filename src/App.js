import "./App.css";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { SelectAnAutomation } from "./components/selectAnAutomation";
import { Home } from "./components/home";
import { Settings } from "./components/settings";
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
        {/* Future paths
        <Route path="/assessment-notices" element={<AssessmentNotices />}></Route>
        <Route path="/change-mailing-address" element={<ChangeMailingAddress />}></Route>
        <Route path="/check-requests" element={<CheckRequests />}></Route>
        <Route path="/payment-confirmations" element={<PaymentConfirmations />}></Route>
        <Route path="/property-point-of-contact" element={<PropertyPointOfContact />}></Route>
        <Route path="/property-tax-bills" element={<PropertyTaxBills />}></Route>
        <Route path="/add-new-parcels" element={<AddNewParcels />}></Route>
        <Route path="/update-parcel-names" element={<UpdateParcelNames />}></Route>
        <Route path="/check-assessor-and-collector-links" element={<CheckAssessorAndCollectorLinks />}></Route>
        <Route path="/pull-parcel-information-from-realquest" element={<PullParcelInformationFromRealquest />}></Route> */}
      </Routes>
    </Router>
  );
};

export default App;
