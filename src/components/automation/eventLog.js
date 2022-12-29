// Library Imports
import { useEffect, useState } from "react";
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

/*
  When the component was first made, it would simply map through the entire
  eventLogContents array, but it was causing performance issues and  white screen
  crashes when the array got too long.
  
  For performance's sake, the event log now displays the 20 most recent messages.
*/

export const EventLog = ({ busClientRenderer, automationStatus }) => {
  const [animationParent] = useAutoAnimate();
  const eventLogState = useSelector((state) => state.eventLog);
  const eventLogContents = eventLogState.contents[RECEIVE_EVENT_LOG_DATA];
  const [visibleMessages, setVisibleMessages] = useState([]);
  useEventLogData(busClientRenderer);

  /* 
    When the eventLogContents changes, get the last
    20 elements of the array and display those
  */

  useEffect(() => {
    let tempVisibleMessages = [];
    if (eventLogContents.length <= 20) {
      tempVisibleMessages = [...eventLogContents];
    } else {
      const tempEventLogContents = [...eventLogContents];
      tempVisibleMessages = tempEventLogContents.slice(-20);
    }

    if (tempVisibleMessages.length > 0) {
      setVisibleMessages(tempVisibleMessages);
    }
  }, [eventLogState, eventLogContents]);

  return (
    <div
      id="event-log-wrapper"
      className={`${automationStatus === "In Progress" ? "" : "mt-2"}`}
    >
      <div id="event-log" className="container-fluid">
        <div className="row py-4" ref={animationParent}>
          {visibleMessages?.length < 1 ? (
            <div key={nanoid()} className={`col col-12`}>
              This is the event log! When the automation begins this section
              will display important information about what is happening while
              it's running.
            </div>
          ) : (
            visibleMessages.map((logEntry) => {
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
