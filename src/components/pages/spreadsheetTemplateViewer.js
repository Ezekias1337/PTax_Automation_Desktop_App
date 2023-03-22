// Library Imports
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { useAutoAnimate } from "@formkit/auto-animate/react";
// Constants
import { automationList } from "../../constants/automation-list/automationList";
import { spreadsheetTemplates } from "../../constants/spreadsheet-templates/allTemplates";
// Redux
//Redux
import { SAVE_SPREADSHEET } from "../../redux/actionCreators/spreadsheetCreators";
// Functions, Helpers, Utils, and Hooks
import { renderSelectOptions } from "../../functions/forms/renderSelectOptions";
import { showToast } from "../../functions/toast/showToast";

import { camelCasifyString } from "../../utils/strings/camelCasifyString";

import { useIsComponentLoaded } from "../../hooks/useIsComponentLoaded";
import { useIsFormFilled } from "../../hooks/useIsFormFilled";
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
import { usePersistentSettings } from "../../hooks/usePersistentSettings";
import { useSpreadsheetData } from "../../hooks/ipc/useSpreadsheetData";
// Components
import { TitleBar } from "../general-page-layout/titlebar";
import { Header } from "../general-page-layout/header";
import { Loader } from "../general-page-layout/loader";
import { SpreadsheetPreviewer } from "../spreadsheet-previewer/spreadsheetPreviewer";
import { DownloadButton } from "../buttons/downloadButton";
import { DropDown } from "../input-fields/dropdown";
import { TextInput } from "../input-fields/textInput";
import { FileOrDirectoryPicker } from "../input-fields/fileOrDirectoryPicker";
// CSS
import "../../css/styles.scss";

export const SpreadsheetTemplateViewer = () => {
  const state = useSelector((state) => state);
  const { backgroundPositionX, backgroundPositionY, animationName } =
    state.animatedBackground.contents;
  const saveSpreadsheetMessages = state.spreadsheet.messages[SAVE_SPREADSHEET];
  const [animationParent] = useAutoAnimate();

  usePersistentSettings();
  useAnimatedBackground();
  useSpreadsheetData();

  const [isLogicCompleted, setIsLogicCompleted] = useState(false);
  const [downloadOptions, setDownloadOptions] = useState({
    automation: "",
    fileName: "",
    downloadDirectory: "",
    arrayOfSheets: [],
  });
  const [selectedSpreadsheetData, setSelectedSpreadsheetData] = useState([]);
  const [formReady, setFormReady] = useState(false);
  useIsFormFilled(downloadOptions, setFormReady);
  const isComponentLoaded = useIsComponentLoaded({
    conditionsToTest: [isLogicCompleted],
    testForBoolean: true,
  });

  /* 
    Update the spreadsheet previewer when the user changes the
    automation
  */

  useEffect(() => {
    if (downloadOptions.automation !== "") {
      setSelectedSpreadsheetData(
        spreadsheetTemplates[camelCasifyString(downloadOptions.automation)]
      );
    }
    setIsLogicCompleted(true);
  }, [downloadOptions.automation]);

  /* 
    Update the spreadsheet data that will be sent to the backend
    for writing file to system
  */

  useEffect(() => {
    setDownloadOptions((prevState) => ({
      ...prevState,
      arrayOfSheets: selectedSpreadsheetData,
    }));
  }, [selectedSpreadsheetData]);

  /* 
    Show success toast when spreadsheet saves successfully
  */

  useEffect(() => {
    let tempSaveSpreadsheetMessages = [...saveSpreadsheetMessages];

    if (tempSaveSpreadsheetMessages.slice(-1)[0] === "Download Successful") {
      showToast("Spreadsheet Saved!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [saveSpreadsheetMessages]);

  if (isComponentLoaded === false) {
    return (
      <div
        id="element-to-animate"
        data-theme={
          state.settings.contents.colorTheme !== undefined
            ? state.settings.contents.colorTheme
            : "Gradient"
        }
        data-animation-name={animationName}
        style={{
          backgroundPositionX: backgroundPositionX,
          backgroundPositionY: backgroundPositionY,
        }}
      >
        <TitleBar />
        <Header pageTitle="Spreadsheet Templates" />
        <Loader showLoader={true} />;
      </div>
    );
  }

  return (
    <div
      id="element-to-animate"
      data-theme={
        state.settings.contents.colorTheme !== undefined
          ? state.settings.contents.colorTheme
          : "Gradient"
      }
      data-animation-name={animationName}
      style={{
        backgroundPositionX: backgroundPositionX,
        backgroundPositionY: backgroundPositionY,
      }}
    >
      <TitleBar />

      <div className="container-for-scroll">
        <Header pageTitle="Spreadsheet Templates" includeArrow={false} />
        <ToastContainer
          position="bottom-center"
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

        <div className="row mx-1 mt-2">
          <DropDown
            isSettingsDropdown={false}
            data={{ name: "Automation" }}
            state={null}
            setStateHook={setDownloadOptions}
            availableChoices={renderSelectOptions(
              Object.values(automationList)
            )}
          />
          <TextInput
            data={{ name: "File Name" }}
            setStateHook={setDownloadOptions}
          />
          <FileOrDirectoryPicker
            data={{
              name: "Download Directory",
              customInputType: "text",
              placeholder: "C:/Users/Name/Downloads/",
            }}
            state={state}
            promptType="directory"
            setStateHook={setDownloadOptions}
            inputValueState={downloadOptions?.downloadDirectory}
            reduxStateName="downloadDirectory"
          />
          <div
            className="col col-6 mt-2"
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "end",
            }}
          >
            <DownloadButton
              downloadOptions={downloadOptions}
              enabled={formReady}
              isFullSize={false}
            />
          </div>
        </div>

        <div className="row mx-1 mt-2" ref={animationParent}>
          <SpreadsheetPreviewer spreadSheetData={selectedSpreadsheetData} />
        </div>
      </div>
    </div>
  );
};
