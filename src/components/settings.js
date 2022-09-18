import { TitleBar } from "./titlebar";
import { listOfSettings } from "../data/listOfSettings";
import { HomeButton } from "./buttons/homeButton";
import { SaveButton } from "./buttons/saveButton";
import { useLayoutEffect, useEffect, useState } from "react";
import { animateGradientBackground } from "../functions/animateGradientBackground";
import { useSelector, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../redux/allActions";
import { saveUserSettings } from "../functions/saveUserSettings";
import { popUpAlert } from "../functions/popUpAlert";
import { GeneralAlert } from "./generalAlert";
import { DropDown } from "./inputFields/dropdown";
import { FileOrDirectoryPicker } from "./inputFields/fileOrDirectoryPicker";
import { TextInput } from "./inputFields/textInput";
import { Switch } from "./inputFields/switch";
import "../css/sass_css/styles.scss";
import "../css/sass_css/inputs.scss";

export const Settings = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const { saveSettings } = bindActionCreators(actionCreators, dispatch);
  const [userSettings, setUserSettings] = useState({
    colorTheme: "gradient",
    firstTimeRunning: false,
    screenResolution: "800x600",
    username: "",
    password: "",
    defaultDownloadDirectory: "",
    defaultUploadandScanDirectory: "",
    launchWindowinCurrentPosition: false,
  });

  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();

    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, []);

  const arrayOfSettings = [];
  let counter = 1;

  for (const item of Object.entries(listOfSettings)) {
    if (item[1]?.inputCategory === "dropdown") {
      arrayOfSettings.push(
        <DropDown
          key={counter}
          data={item[1]}
          state={state}
          settingsOrAutomation="settings"
          setStateHook={setUserSettings}
        />
      );
    } else if (item[1]?.inputCategory === "fileOrDirectory") {
      let inputValueState;
      if (item[1]?.name === "Default Download Directory") {
        inputValueState = userSettings?.defaultDownloadDirectory;
      } else if (item[1]?.name === "Default Upload and Scan Directory") {
        inputValueState = userSettings?.defaultUploadandScanDirectory;
      }

      arrayOfSettings.push(
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
      arrayOfSettings.push(
        <TextInput
          key={counter}
          data={item[1]}
          state={state}
          setStateHook={setUserSettings}
        />
      );
    } else if (item[1]?.inputCategory === "switch") {
      arrayOfSettings.push(
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

  return (
    <div data-theme={state.settings.colorTheme} id="element-to-animate">
      <TitleBar />
      <div className="row page-title">
        <h1>Settings</h1>
      </div>
      <div className="container-for-scroll">
        <div className="row mx-1">{arrayOfSettings}</div>
        <div className="row mt-3">
          <div className="col col-5"></div>
          <div className="col col-2">
            <SaveButton
              idForButton="save-button"
              onClickHandler={() => {
                const settingsToPass = saveUserSettings(userSettings);
                saveSettings(settingsToPass);
                popUpAlert("alert-to-animate");
              }}
            />
          </div>
          <div className="col col-5"></div>
        </div>
        <div className="row mx-1">
          <div className="col col-12 mt-5">
            <HomeButton />
          </div>
        </div>
      </div>

      <GeneralAlert
        id="alert-to-animate"
        isVisible={false}
        string="&nbsp;Settings saved successfully!"
        colorClassName="alert-success"
      ></GeneralAlert>
    </div>
  );
};
