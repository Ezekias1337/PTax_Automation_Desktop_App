import logo from "../src/images/PTax_Logo.png";
import "./App.css";
import { Button } from "reactstrap";
import { HashRouter as Router, Route, Routes, Link } from "react-router-dom";
import { SelectAnAutomation } from "./components/selectAnAutomation";

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Link to={"/select-an-automation"}>
            <Button className="mt-5">Start Automation</Button>
          </Link>
        </header>
      </div>
      <Routes>
        <Route
          path="/select-an-automation"
          element={<SelectAnAutomation />}
        ></Route>
      </Routes>
    </Router>
  );
}

export default App;
