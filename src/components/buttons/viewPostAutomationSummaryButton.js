// Library Imports
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

export const ViewPostAutomationSummaryButton = () => {
  return (
    <Link to={"/post-automation-summary"}>
      <Button className="styled-button animated-button" alt="settings-button">
        View
      </Button>
    </Link>
  );
};
