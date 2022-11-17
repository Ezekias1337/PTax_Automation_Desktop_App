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
  faUser,
  faKey,
  faCalendar,
  faHashtag,
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
    let firstElePascalCasified = pascalCasifyString(firstEle);
    let iconForList = <FontAwesomeIcon icon={faRobot} />;
    let needsToBeObscured = false;

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
      case "Assessment Year":
        iconForList = <FontAwesomeIcon icon={faCalendar} />;
        break;
      case "Tax Year":
        iconForList = <FontAwesomeIcon icon={faCalendar} />;
        break;
      case "Ptax Username":
        iconForList = <FontAwesomeIcon icon={faUser} />;
        break;
      case "Ptax Password":
        iconForList = <FontAwesomeIcon icon={faKey} />;
        needsToBeObscured = true;
        break;
      case "Parcel Quest Username":
        iconForList = <FontAwesomeIcon icon={faUser} />;
        break;
      case "Parcel Quest Password":
        iconForList = <FontAwesomeIcon icon={faKey} />;
        needsToBeObscured = true;
        break;
      case "Installment Number":
        iconForList = <FontAwesomeIcon icon={faHashtag} />;
        break;
      default:
        iconForList = <></>;
        break;
    }

    let elementNameObscured = "";
    if (needsToBeObscured === true) {
      for (const char of secondEle) {
        elementNameObscured += "*";
      }
    }

    return (
      <div key={nanoid()} className="card-body-row">
        {iconForList}
        <b>{`${firstElePascalCasified}: `}</b>
        {needsToBeObscured === false ? secondEle : elementNameObscured}
      </div>
    );
  });
};
