import { TitleBar } from "./titlebar";
import { listOfSettings } from "../data/listOfSettings";
import { Header } from "./header";
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
  const [arrayOfSettings, setArrayOfSettings] = useState([]);
  const [userSettings, setUserSettings] = useState({
    colorTheme: "Gradient",
    firstTimeRunning: false,
    screenResolution: "800x600",
    username: "",
    password: "",
    downloadDirectory: "",
    uploadDirectory: "",
    launchWindowinCurrentPosition: false,
  });

  useLayoutEffect(() => {
    const backgroundInterval = animateGradientBackground();

    return function cleanup() {
      clearInterval(backgroundInterval);
    };
  }, []);

  useEffect(() => {
    const tempArrayOfSettings = [];
    let counter = 1;

    for (const item of Object.entries(listOfSettings)) {
      if (item[1]?.inputCategory === "dropdown") {
        tempArrayOfSettings.push(
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
  }, [state, userSettings]);

  return (
    <div
      data-theme={
        state.settings.colorTheme !== undefined
          ? state.settings.colorTheme
          : "Gradient"
      }
      id="element-to-animate"
    >
      <TitleBar />
      <Header pageTitle="Settings" includeArrow={false} />
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
