// Library Imports
import { useSelector } from "react-redux";
import { nanoid } from "nanoid";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// Functions, Helpers, Utils and Hooks
import { useEventLogData } from "../../hooks/ipc/useEventLogData";
// Action Types
import { RECEIVE_EVENT_LOG_DATA } from "../../redux/actionCreators/eventLogCreators";
// Components
//import { ClipboardButton } from "../buttons/clipboardButton";
//import { SpreadsheetButton } from "../buttons/spreadsheetButton";
// CSS
import "../../css/styles.scss";
import "../../css/event-log.scss";

export const EventLog = ({ busClientRenderer, automationStatus }) => {
  const [animationParent] = useAutoAnimate();
  const eventLogState = useSelector((state) => state.eventLog);
  const eventLogContents = eventLogState.contents[RECEIVE_EVENT_LOG_DATA];
  useEventLogData(busClientRenderer);

  return (
    <div
      id="event-log-wrapper"
      className={`${automationStatus === "In Progress" ? "" : "mt-2"}`}
    >
      <div className="container-fluid event-log">
        <div className="row py-4" ref={animationParent}>
          {eventLogContents?.length < 1 ? (
            <div key={nanoid()} className={`col col-12`}>
              This is the event log! When the automation begins this section
              will display import information about what is happening while it's
              running.
            </div>
          ) : (
            eventLogContents.map((logEntry) => {
              return (
                <div
                  key={nanoid()}
                  className={`col col-12 ${logEntry.color}-message`}
                >
                  {logEntry.message}
                </div>
              );
            })
          )}
        </div>
      </div>
      {/* <div className="row mt-2">
        <div className="col col-1 me-1">
          <ClipboardButton />
        </div>
        <div className="col col-1">
          <SpreadsheetButton />
        </div>
      </div> */}
    </div>
  );
};
