// Library Imports
import { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Redux
import { actionCreators } from "../../redux/allActions";
// Functions, Helpers, Utils, and Hooks
import { showToast } from "../../functions/toast/showToast";
import { sendToIpc } from "../../functions/ipc/renderer/send/sendToIpc";
import { replaceBackslashWithForwardSlash } from "../../utils/strings/replaceBackslashWithForwardSlash";
import { useSpreadsheetData } from "../../hooks/ipc/useSpreadsheetData";
// Constants
// Action Types
import { READ_SPREADSHEET } from "../../redux/actionCreators/spreadsheetCreators";
// Components
import { Card } from "../card/card";
import { Loader } from "../general-page-layout/loader";
// CSS

export const SpreadSheetExampleAndValidator = ({ automationConfig }) => {
  const spreadsheetState = useSelector((state) => state.spreadsheet);
  const spreadsheetMessages =
    spreadsheetState.messages[READ_SPREADSHEET];
  const spreadsheetContents =
    spreadsheetState.contents[READ_SPREADSHEET];
  const spreadsheetLoading =
    spreadsheetState.loading[READ_SPREADSHEET];
  const spreadsheetErrors =
    spreadsheetState.errors[READ_SPREADSHEET];

  useEffect(() => {
    const tempErrorArrayIndex = spreadsheetErrors?.length - 1;

    if (tempErrorArrayIndex >= 0) {
      showToast(spreadsheetErrors[tempErrorArrayIndex]);
    }
  }, [spreadsheetState, spreadsheetErrors]);

  /* console.table({
    spreadsheetMessages,
    spreadsheetContents,
    spreadsheetLoading,
    spreadsheetErrors,
  }); */

  useSpreadsheetData();
  if (spreadsheetLoading === true) {
    return <Loader />;
  } /* else if (validationError === true) {
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
  } */ else {
    return (
      <>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
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
      </>
    );
  }
};
