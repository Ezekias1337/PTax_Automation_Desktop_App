import logo from "../../src/images/PTax_Logo.png";
import "../App.css";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Link to={"/select-an-automation"}>
          <Button className="mt-5">Start Automation</Button>
        </Link>
      </header>
    </div>
  );
};
