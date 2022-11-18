// Library Imports
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleStop } from "@fortawesome/free-solid-svg-icons";
// Redux
import { actionCreators } from "../../redux/allActions";
// Functions, Helpers, Utils, and Hooks
import { cancelAutomation } from "../../functions/automation/cancelAutomation";

export const StopAutomationButton = ({
  busClientRenderer,
  automationName,
  allIterations,
  completedIterations,
  failedIterations,
  setAutomationStatus,
}) => {
  const dispatch = useDispatch();
  const { cancelledIteration } = bindActionCreators(
    actionCreators.automationCreators,
    dispatch
  );

  return (
    <div className="row mt-5">
      <div className="col col-4"></div>
      <div className="col col-4 full-flex">
        <Button
          className="full-width-button styled-button flex-button async-button"
          onClick={async () => {
            const arrayOfCancelledIterations = await cancelAutomation(
              busClientRenderer,
              automationName,
              allIterations,
              completedIterations,
              failedIterations
            );
            cancelledIteration(null, arrayOfCancelledIterations);
            setAutomationStatus("Completed");
          }}
          alt="clipboard-button"
          id="start-automation-button"
        >
          <FontAwesomeIcon icon={faCircleStop} size="2x" />
        </Button>
      </div>
      <div className="col col-4"></div>
    </div>
  );
};
