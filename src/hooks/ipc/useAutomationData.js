// Library Imports
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
// Redux
import { actionCreators } from "../../redux/allActions";

/* 
    Update the redux state with the spreadsheet data from the backend
*/

export const useAutomationData = (busClientRenderer) => {
  const dispatch = useDispatch();

  const {
    recieveIteration,
    completedIteration,
    cancelledIteration,
    failedIteration,
    automationFinished,
    chromeDriverNeedsUpdate,
    chromeNotInstalled,
    unknownError,
  } = bindActionCreators(actionCreators.automationCreators, dispatch);

  useEffect(() => {
    if (busClientRenderer !== null) {
      busClientRenderer.on("current-iteration-info", recieveIteration);
      busClientRenderer.on("send-successful-iteration", completedIteration);
      busClientRenderer.on("send-cancelled-iteration", cancelledIteration);
      busClientRenderer.on("send-failed-iteration", failedIteration);
      busClientRenderer.on("send-automation-completed", automationFinished);

      busClientRenderer.on(
        "send-chrome-driver-needs-update",
        chromeDriverNeedsUpdate
      );
      busClientRenderer.on("send-chrome-not-installed", chromeNotInstalled);

      busClientRenderer.on("send-unknown-error", unknownError);
    }

    return () => {
      if (busClientRenderer !== null) {
        busClientRenderer.removeListener(
          "current-iteration-info",
          recieveIteration
        );
        busClientRenderer.removeListener(
          "send-successful-iteration",
          completedIteration
        );
        busClientRenderer.removeListener(
          "send-cancelled-iteration",
          cancelledIteration
        );

        busClientRenderer.removeListener(
          "send-failed-iteration",
          failedIteration
        );
        busClientRenderer.removeListener(
          "send-automation-completed",
          automationFinished
        );

        busClientRenderer.removeListener(
          "send-chrome-driver-needs-update",
          chromeDriverNeedsUpdate
        );
        busClientRenderer.removeListener(
          "send-chrome-not-installed",
          chromeNotInstalled
        );

        busClientRenderer.removeListener("send-unknown-error", unknownError);
      }
    };
  }, [
    recieveIteration,
    busClientRenderer,
    completedIteration,
    cancelledIteration,
    failedIteration,
    automationFinished,
    chromeDriverNeedsUpdate,
    chromeNotInstalled,
    unknownError,
  ]);
};
