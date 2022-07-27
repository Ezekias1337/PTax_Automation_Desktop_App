import "../css/vanilla_css/styles.css";
import "../css/vanilla_css/event-log.css";
import { ClipboardButton } from "./buttons/clipboardButton";
import { SpreadsheetButton } from "./buttons/spreadsheetButton";

export const EventLog = (props) => {
  return (
    <>
      <div className="row mb-2">
        <div className="col col-1 me-1">
          <ClipboardButton />
        </div>
        <div className="col col-1">
          <SpreadsheetButton />
        </div>
      </div>
      <div className="container-fluid event-log">
        <div className="row">
          {/* {props.eventLogEntries.forEach(() => {
            <div className={`col col-12 ${logColor}-message`}>{logText}</div>
          })} */}
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12">loading...</div>
          <div className="col col-12">getting data</div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12">loading...</div>
          <div className="col col-12">getting data</div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12">loading...</div>
          <div className="col col-12">getting data</div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12">loading...</div>
          <div className="col col-12">getting data</div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12">loading...</div>
          <div className="col col-12">getting data</div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12">loading...</div>
          <div className="col col-12">getting data</div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12">loading...</div>
          <div className="col col-12">getting data</div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12">loading...</div>
          <div className="col col-12">getting data</div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12">loading...</div>
          <div className="col col-12">getting data</div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12">loading...</div>
          <div className="col col-12">getting data</div>
        </div>
      </div>
    </>
  );
};
