// Library Imports
import { nanoid } from "nanoid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot,
  faFileExcel,
  faDownload,
  faFlagUsa,
  faFlag,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
// Functions, Helpers, Utils, and Hooks
import { pascalCasifyString } from "../../utils/strings/pascalCasifyString";

export const renderAutomationConfigCardBody = (cardBodyArray) => {
  return cardBodyArray.map((body) => {
    /* 
        cardBodyArray prop takes an array which was returned
        from Object.entries():

            firstEle is the Key
            secondEle is the Value
    */

    const [firstEle, secondEle] = body;
    const firstElePascalCasified = pascalCasifyString(firstEle);
    let iconForList = <FontAwesomeIcon icon={faRobot} />;

    switch (firstElePascalCasified) {
      case "Automation":
        iconForList = <FontAwesomeIcon icon={faRobot} />;
        break;
      case "Spreadsheet File":
        iconForList = <FontAwesomeIcon icon={faFileExcel} />;
        break;
      case "Download Directory":
        iconForList = <FontAwesomeIcon icon={faDownload} />;
        break;
      case "State":
        iconForList = <FontAwesomeIcon icon={faFlagUsa} />;
        break;
      case "County":
        iconForList = <FontAwesomeIcon icon={faFlag} />;
        break;
      case "Operation":
        iconForList = <FontAwesomeIcon icon={faWrench} />;
        break;
      default:
        iconForList = <></>;
        break;
    }

    return (
      <div key={nanoid()} className="card-body-row">
        {iconForList}
        <b>{`     ${firstElePascalCasified}: `}</b>
        {secondEle}
      </div>
    );
  });
};
