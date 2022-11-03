// Library Imports
import { useEffect } from "react";
import { Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
// Redux
import { actionCreators } from "../../redux/allActions";
// Functions, Helpers, Utils, and Hooks
import { sendToIpc } from "../../functions/ipc/renderer/send/sendToIpc";
import { replaceBackslashWithForwardSlash } from "../../utils/strings/replaceBackslashWithForwardSlash";
import { useSpreadsheetData } from "../../hooks/ipc/useSpreadsheetData";
// Constants

// Components
import { Card } from "../card/card";
// CSS

// ! NEED TO USE REDUX CONNECT FUNCTION

export const SpreadSheetExampleAndValidator = ({
  setSpreadsheetData,
  automationConfig,
  spreadsheetUploaded = false,
  validationError = false,
}) => {
  useSpreadsheetData();

  if (validationError === true) {
    return (
      <Card
        buttonContent={[
          { text: "Preview", onClickHandler: null },
          { text: "Download", onClickHandler: null },
          { text: "Validate", onClickHandler: null },
        ]}
        cardText="One or more data validation errors occurred. Please verify that the spreadsheet has the correct column names by previewing or downloading the template examples below before trying again."
      />
    );
  } else if (spreadsheetUploaded === true) {
    return (
      <Card
        buttonContent={[{ text: "Preview", onClickHandler: null }]}
        cardText="Your spreadsheet file has been successfully uploaded and validated. You may preview it now if you'd like:"
      />
    );
  } else {
    return (
      <Card
        buttonContent={[
          { text: "Preview", onClickHandler: null },
          { text: "Download", onClickHandler: null },
          {
            text: "Validate",
            onClickHandler: sendToIpc,
            buttonArguments: [
              "readSpreadsheet",
              automationConfig.spreadsheetFile,
            ],
            additionalClassNames: "animated-button",
          },
        ]}
        cardText="Below you may preview or download the spreadsheet template for the selected operation/location. After selecting your Spreadsheet File, press the Validate button."
      />
    );
  }
};
