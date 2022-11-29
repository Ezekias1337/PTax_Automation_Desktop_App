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

export const SpreadSheetExampleAndValidator = ({
  automationConfig,
  formReady,
  setStateHook = null,
  automationReady = null,
  automationStatus = null,
}) => {
  useSpreadsheetData();
  const spreadsheetState = useSelector((state) => state.spreadsheet);
  const spreadsheetMessages = spreadsheetState.messages[READ_SPREADSHEET];
  const spreadsheetContents = spreadsheetState.contents[READ_SPREADSHEET];
  const spreadsheetLoading = spreadsheetState.loading[READ_SPREADSHEET];
  const spreadsheetErrors = spreadsheetState.errors[READ_SPREADSHEET];

  useEffect(() => {
    const tempErrorArrayIndex = spreadsheetErrors?.length - 1;

    if (tempErrorArrayIndex >= 0) {
      showToast(spreadsheetErrors[tempErrorArrayIndex]);
    }
  }, [spreadsheetState, spreadsheetErrors]);

  if (spreadsheetLoading === true) {
    return <Loader />;
  } else if (formReady === false) {
    return (
      <div className="mt-2">
        <Card cardText="Make sure to fill out the form entirely and ensure a spreadsheet file is selected." />
      </div>
    );
  } else if (automationStatus === "In Progress") {
    return <></>;
  } else if (automationReady === true) {
    return (
      <div className="mt-2">
        <Card cardText="Below is a summary of the options you have selected for this automation. Press the button below it when you are ready to start the automation." />
      </div>
    );
  } else if (spreadsheetContents?.length > 0) {
    return (
      <div className="mt-2">
        <Card
          buttonContent={[
            {
              text: "Proceed",
              onClickHandler: setStateHook,
              buttonArguments: [true],
              additionalClassNames: "animated-button",
            },
          ]}
          cardText="Below are the contents of the spreadsheet you uploaded. If the spreadsheet has multiple pages, the currently selected page will be used."
        />
      </div>
    );
  } else {
    return (
      <div className="mt-2">
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
            {
              text: "Upload",
              onClickHandler: sendToIpc,
              buttonArguments: [
                "readSpreadsheet",
                automationConfig.spreadsheetFile,
              ],
              additionalClassNames: "animated-button",
            },
          ]}
          cardText="Now that you have selected your options, press the upload button to upload the spreadsheet."
        />
      </div>
    );
  }
};
