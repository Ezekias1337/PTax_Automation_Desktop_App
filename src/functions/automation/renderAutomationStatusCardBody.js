// Library Imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons";
// Functions, Helpers, Utils, and Hooks
import { pascalCasifyString } from "../../utils/strings/pascalCasifyString";

export const renderAutomationStatusCardBody = (
  isInitializing,
  currentIterator,
  iteratorTypeName
) => {
  /* 
    In most situations iteratorTypeName will be Parcel Number, however
    there are a few automations that use other things for this value
  */

  if (isInitializing === true) {
    return (
      <div className="card-body-row">
        <FontAwesomeIcon icon={faBox} />
        <b>Initializing...</b>
      </div>
    );
  }

  return (
    <div className="card-body-row">
      <FontAwesomeIcon icon={faBox} />
      <b>Working on: </b>
      {`${pascalCasifyString(iteratorTypeName)} ${pascalCasifyString(
        currentIterator
      )}`}
    </div>
  );
};
