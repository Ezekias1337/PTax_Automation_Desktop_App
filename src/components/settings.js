import "../css/vanilla_css/styles.css";
import "../css/vanilla_css/settings.css";
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
import { renderDropdownOptions } from "../functions/renderDropdownOptions";
import { saveUserSettings } from "../functions/saveUserSettings";
import { camelCasifyString } from "../functions/camelCasifyString";
import { inputFieldFillDefault } from "../functions/inputFieldFillDefault";
import { popUpAlert } from "../functions/popUpAlert";
import { GeneralAlert } from "./generalAlert";

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
    if (item[1]?.options !== null) {
      const [arrayOfOptionElements, selectedOption] = renderDropdownOptions(
        item[1],
        state
      );
      arrayOfSettings.push(
        <div key={counter} className="col col-6 mt-2">
          <label htmlFor={item[1].name} className="col-form-label">
            {item[1].name}
          </label>

          <select
            className="form-select full-width-button brown-input"
            aria-label={item[1].name}
            id={camelCasifyString(item[1].name)}
            defaultValue={selectedOption ? selectedOption : null}
          >
            {arrayOfOptionElements}
          </select>
        </div>
      );
    } else if (item[1]?.acceptsCustomInput !== false) {
      arrayOfSettings.push(
        <div key={counter} className="col col-6 mt-2">
          <label htmlFor={item[1].name} className="col-form-label">
            {item[1].name}
          </label>
          <input
            type={item[1].customInputType}
            className="form-control brown-input"
            name={item[1].name}
            id={item[1].name.split(" ").join("")}
            placeholder={item[1]?.placeholder}
            defaultValue={
              inputFieldFillDefault(
                item[1].name.split(" ").join(""),
                state,
                false
              )
                ? inputFieldFillDefault(
                    item[1].name.split(" ").join(""),
                    state,
                    false
                  )
                : ""
            }
          ></input>
        </div>
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
      <div className="row mt-5">
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
            <Button className="brown-button">
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
