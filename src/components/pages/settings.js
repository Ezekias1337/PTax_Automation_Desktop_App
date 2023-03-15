// Library Imports
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Redux
import { actionCreators } from "../../redux/allActions";
// Functions, Helpers, Utils, and Hooks
import { showToast } from "../../functions/toast/showToast";
import { saveUserSettings } from "../../functions/settings/saveUserSettings";

import { useIsComponentLoaded } from "../../hooks/useIsComponentLoaded";
import { useAnimatedBackground } from "../../hooks/useAnimatedBackground";
// Constants
import { listOfSettings } from "../../constants/listOfSettings";
// Components
import { TitleBar } from "../general-page-layout/titlebar";
import { Header } from "../general-page-layout/header";
import { Loader } from "../general-page-layout/loader";
import { SaveButton } from "../buttons/saveButton";
import { DropDown } from "../input-fields/dropdown";
import { FileOrDirectoryPicker } from "../input-fields/fileOrDirectoryPicker";
import { TextInput } from "../input-fields/textInput";
import { Switch } from "../input-fields/switch";
// CSS
import "../../css/styles.scss";
import "../../css/inputs.scss";

export const Settings = () => {
  useAnimatedBackground();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { saveSettings } = bindActionCreators(
    actionCreators.settingsCreators,
    dispatch
  );
  const { backgroundPositionX, backgroundPositionY, animationName } =
    state.animatedBackground.contents;
  const [animationParent] = useAutoAnimate();

  const [isLogicCompleted, setIsLogicCompleted] = useState(false);
  const [arrayOfSettings, setArrayOfSettings] = useState([]);
  const [userSettings, setUserSettings] = useState({
    colorTheme: "Gradient",
    firstTimeRunning: false,
    screenResolution: "800x600",
    ptaxUsername: "",
    ptaxPassword: "",
    parcelQuestUsername: "",
    parcelQuestPassword: "",
    downloadDirectory: "",
    uploadDirectory: "",
    launchWindowinCurrentPosition: false,
    launchWindowinCurrentPositionvalue: "0x0",
  });
  const isComponentLoaded = useIsComponentLoaded({
    conditionsToTest: [isLogicCompleted],
    testForBoolean: true,
  });

  useEffect(() => {
    const tempArrayOfSettings = [];
    let counter = 1;

    for (const item of Object.entries(listOfSettings)) {
      if (item[1]?.inputCategory === "dropdown") {
        tempArrayOfSettings.push(
          <DropDown
            key={counter}
            isSettingsDropdown={true}
            data={item[1]}
            state={state}
            setStateHook={setUserSettings}
          />
        );
      } else if (item[1]?.inputCategory === "fileOrDirectory") {
        let inputValueState;
        if (item[1]?.name === "Download Directory") {
          inputValueState = userSettings?.downloadDirectory;
        } else if (item[1]?.name === "Upload Directory") {
          inputValueState = userSettings?.uploadDirectory;
        }

        tempArrayOfSettings.push(
          <FileOrDirectoryPicker
            key={counter}
            data={item[1]}
            state={state}
            promptType="directory"
            setStateHook={setUserSettings}
            inputValueState={inputValueState}
          />
        );
      } else if (item[1]?.inputCategory === "text") {
        tempArrayOfSettings.push(
          <TextInput
            key={counter}
            data={item[1]}
            state={state}
            setStateHook={setUserSettings}
          />
        );
      } else if (item[1]?.inputCategory === "switch") {
        tempArrayOfSettings.push(
          <Switch
            key={counter}
            data={item[1]}
            state={state}
            setStateHook={setUserSettings}
          />
        );
      }
      counter++;
    }

    setArrayOfSettings(tempArrayOfSettings);
    setIsLogicCompleted(true);
  }, [state, userSettings]);

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
        <Header pageTitle="Settings" />
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
      <Header pageTitle="Settings" includeArrow={false} />
      <div className="container-for-scroll">
        <ToastContainer
          position="bottom-center"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <div className="row mx-1" ref={animationParent}>
          {arrayOfSettings}
        </div>
        <div className="row mt-3">
          <div className="col col-5"></div>
          <div className="col col-2">
            <SaveButton
              idForButton="save-button"
              onClickHandler={() => {
                const settingsToPass = saveUserSettings(userSettings);
                saveSettings(settingsToPass);

                showToast("Settings Saved!", {
                  position: "bottom-center",
                  autoClose: 2500,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              }}
            />
          </div>
          <div className="col col-5"></div>
        </div>
      </div>
    </div>
  );
};
