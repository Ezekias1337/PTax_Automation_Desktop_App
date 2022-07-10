import "../css/vanilla_css/styles.css";
import "../css/vanilla_css/inputs.css";
import { listOfSettings } from "../data/listOfSettings";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { SaveButton } from "./buttons/saveButton";
import { useLayoutEffect } from "react";
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

export const Settings = () => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const { saveSettings } = bindActionCreators(actionCreators, dispatch);

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
          counter={counter}
          data={item[1]}
          state={state}
          settingsOrAutomation="settings"
        />
      );
    } else if (item[1]?.inputCategory === "fileOrDirectory") {
      arrayOfSettings.push(
        <FileOrDirectoryPicker
          key={counter}
          counter={counter}
          data={item[1]}
          state={state}
          promptType="directory"
        />
      );
    } else if (item[1]?.inputCategory === "text") {
      arrayOfSettings.push(
        <TextInput
          key={counter}
          counter={counter}
          data={item[1]}
          state={state}
        />
      );
    } else if (item[1]?.inputCategory === "switch") {
      arrayOfSettings.push(
        <Switch
          key={counter}
          counter={counter}
          data={item[1]}
          state={state}
        />
      );
    }
    counter++;
  }

  return (
    <div
      className="container-fluid"
      data-theme={state.settings.colorTheme}
      id="element-to-animate"
    >
      <div className="row">{arrayOfSettings}</div>
      <div className="row mt-3">
        <div className="col col-5"></div>
        <div className="col col-2">
          <SaveButton
            idForButton="save-button"
            onClickHandler={() => {
              const settingsToPass = saveUserSettings();
              saveSettings(settingsToPass);
              popUpAlert("alert-to-animate");
            }}
          />
        </div>
        <div className="col col-5"></div>
      </div>
      <div className="row">
        <div className="col col-12 mt-5">
          <Link to={"/"}>
            <Button className="styled-button">
              <FontAwesomeIcon icon={faHouse} />
            </Button>
          </Link>
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
