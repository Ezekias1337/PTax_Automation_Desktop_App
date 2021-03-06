import "../css/vanilla_css/styles.css";
import "../css/vanilla_css/event-log.css";
import { ClipboardButton } from "./buttons/clipboardButton";
import { SpreadsheetButton } from "./buttons/spreadsheetButton";

export const EventLog = (props) => {
  return (
    <>
      <div className="container-fluid event-log">
        <div className="row">
          {/* {props.eventLogEntries.forEach(() => {
            <div className={`col col-12 ${logColor}-message`}>{logText}</div>
          })} */}
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12 orange-message">
            Working on parcel: 123-456-789{" "}
          </div>
          <div className="col col-12">loading...</div>
          <div className="col col-12 yellow-message">getting data</div>
          <div className="col col-12">Performing Data Entry</div>
          <div className="col col-12 green-message">
            Parcel: 123-456-789 Successful!
          </div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12 orange-message">
            Working on parcel: 123-456-789{" "}
          </div>
          <div className="col col-12">loading...</div>
          <div className="col col-12 yellow-message">getting data</div>
          <div className="col col-12">Performing Data Entry</div>
          <div className="col col-12 red-message">
            Parcel: 123-456-789 Failed!
          </div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12 orange-message">
            Working on parcel: 123-456-789{" "}
          </div>
          <div className="col col-12">loading...</div>
          <div className="col col-12 yellow-message">getting data</div>
          <div className="col col-12">Performing Data Entry</div>
          <div className="col col-12 red-message">
            Parcel: 123-456-789 Failed!
          </div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12 orange-message">
            Working on parcel: 123-456-789{" "}
          </div>
          <div className="col col-12">loading...</div>
          <div className="col col-12 yellow-message">getting data</div>
          <div className="col col-12">Performing Data Entry</div>
          <div className="col col-12 green-message">
            Parcel: 123-456-789 Successful!
          </div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12 orange-message">
            Working on parcel: 123-456-789{" "}
          </div>
          <div className="col col-12">loading...</div>
          <div className="col col-12 yellow-message">getting data</div>
          <div className="col col-12">Performing Data Entry</div>
          <div className="col col-12 green-message">
            Parcel: 123-456-789 Successful!
          </div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12 orange-message">
            Working on parcel: 123-456-789{" "}
          </div>
          <div className="col col-12">loading...</div>
          <div className="col col-12 yellow-message">getting data</div>
          <div className="col col-12">Performing Data Entry</div>
          <div className="col col-12 green-message">
            Parcel: 123-456-789 Successful!
          </div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12 orange-message">
            Working on parcel: 123-456-789{" "}
          </div>
          <div className="col col-12">loading...</div>
          <div className="col col-12 yellow-message">getting data</div>
          <div className="col col-12">Performing Data Entry</div>
          <div className="col col-12 green-message">
            Parcel: 123-456-789 Successful!
          </div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12 orange-message">
            Working on parcel: 123-456-789{" "}
          </div>
          <div className="col col-12">loading...</div>
          <div className="col col-12 yellow-message">getting data</div>
          <div className="col col-12">Performing Data Entry</div>
          <div className="col col-12 green-message">
            Parcel: 123-456-789 Successful!
          </div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12 orange-message">
            Working on parcel: 123-456-789{" "}
          </div>
          <div className="col col-12">loading...</div>
          <div className="col col-12 yellow-message">getting data</div>
          <div className="col col-12">Performing Data Entry</div>
          <div className="col col-12 green-message">
            Parcel: 123-456-789 Successful!
          </div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12 orange-message">
            Working on parcel: 123-456-789{" "}
          </div>
          <div className="col col-12">loading...</div>
          <div className="col col-12 yellow-message">getting data</div>
          <div className="col col-12">Performing Data Entry</div>
          <div className="col col-12 green-message">
            Parcel: 123-456-789 Successful!
          </div>
          <div className="col col-12">Navigating to home page</div>
          <div className="col col-12 orange-message">
            Working on parcel: 123-456-789{" "}
          </div>
          <div className="col col-12">loading...</div>
          <div className="col col-12 yellow-message">getting data</div>
          <div className="col col-12">Performing Data Entry</div>
          <div className="col col-12 green-message">
            Parcel: 123-456-789 Successful!
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col col-1 me-1">
          <ClipboardButton />
        </div>
        <div className="col col-1">
          <SpreadsheetButton />
        </div>
      </div>
    </>
  );
};
