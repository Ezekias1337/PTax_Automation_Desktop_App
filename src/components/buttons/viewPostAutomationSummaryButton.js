// Library Imports
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

export const ViewPostAutomationSummaryButton = () => {
  return (
    <Link to={"/post-automation-summary"} style={{width: "100%"}}>
      <Button className="styled-button animated-button full-width-button" alt="settings-button">
        View
      </Button>
    </Link>
  );
};
