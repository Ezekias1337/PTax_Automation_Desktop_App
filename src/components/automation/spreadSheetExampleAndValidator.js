// Library Imports
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Functions, Helpers, Utils, and Hooks
import { validateSpreadsheet } from "../../helpers/validateSpreadsheet";
import { showToast } from "../../functions/toast/showToast";
import { sendToIpc } from "../../functions/ipc/renderer/send/sendToIpc";
import { useSpreadsheetData } from "../../hooks/ipc/useSpreadsheetData";
// Constants
import { spreadsheetColumns } from "../../constants/spreadsheet-columns/allColumns";
// Action Types
import {
  READ_SPREADSHEET,
  SELECT_SPREADSHEET,
} from "../../redux/actionCreators/spreadsheetCreators";
// Components
import { Card } from "../card/card";
import { Loader } from "../general-page-layout/loader";

export const SpreadSheetExampleAndValidator = ({
  automationConfig,
  formReady,
  setStateHook = null,
  automationReady = null,
  automationStatus = null,
  automationName = null,
}) => {
  useSpreadsheetData();
  const spreadsheetState = useSelector((state) => state.spreadsheet);
  const spreadsheetContents = spreadsheetState.contents[READ_SPREADSHEET];
  const spreadsheetLoading = spreadsheetState.loading[READ_SPREADSHEET];
  const spreadsheetErrors = spreadsheetState.errors[READ_SPREADSHEET];
  const selectedSpreadsheetContents =
    spreadsheetState.contents[SELECT_SPREADSHEET];

  /* 
    Show toast if there is an error parsing the spreadsheet
  */

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
              onClickHandler: validateSpreadsheet,
              buttonArguments: [
                setStateHook,
                selectedSpreadsheetContents,
                spreadsheetColumns,
                automationName,
              ],
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
