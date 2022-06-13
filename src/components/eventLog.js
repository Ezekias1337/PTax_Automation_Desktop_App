import "../css/vanilla_css/styles.css";
import "../css/vanilla_css/event-log.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
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
            <div className={`col col-12 ${logColor}`}>{logText}</div>
          })} */}
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">yolo</div>
          <div className="col col-12">dasdasd</div>
          <div className="col col-12">asdasd</div>
          <div className="col col-12">dasdas</div>
          <div className="col col-12">asdasd</div>
        </div>
      </div>
    </>
  );
};
