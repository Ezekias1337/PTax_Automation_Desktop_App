import "../css/vanilla_css/styles.css";
import "../css/vanilla_css/settings.css";
import { listOfSettings } from "../data/listOfSettings";
import { Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { SaveButton } from "./buttons/saveButton";
import { getUserSettings } from "../utils/getUserSettings";
import { useEffect, useState } from "react";
const Store = window.require("electron-store");

const store = new Store();

const saveUserSettings = () => {
  const arrayOfOptionElements = document.getElementsByClassName("brown-input");
  const listOfCaseSensitiveSettings = [
    "username",
    "password",
    "defaultDownloadDirectory",
    "defaultUploadandScanDirectory",
  ];

  for (const item of arrayOfOptionElements) {
    const labelInnerText = item.previousElementSibling.innerText;
    const labelToCamelCase =
      labelInnerText.charAt(0).toLowerCase() + labelInnerText.slice(1);
    const labelToCamelCaseJoined = labelToCamelCase.split(" ").join("");

    let inputValue;

    if (item?.options) {
      inputValue = item.options[item.selectedIndex].text;
    } else {
      inputValue = item.value;
    }

    if (inputValue === "") {
      continue;
    }

    if (!listOfCaseSensitiveSettings.includes(labelToCamelCaseJoined)) {
      store.set(
        "userSettings." + labelToCamelCaseJoined,
        inputValue.toLowerCase()
      );
    } else if (listOfCaseSensitiveSettings.includes(labelToCamelCaseJoined)) {
      store.set("userSettings." + labelToCamelCaseJoined, inputValue);
    }
  }
  const settingsToReturn = store.get("userSettings");
  console.log("User settings saved!", settingsToReturn);
  return settingsToReturn;
};

const renderDropdownOptions = (objToParse) => {
  const arrayOfOptionElements = [];
  for (const [index, nestedItem] of objToParse.options.entries()) {
    arrayOfOptionElements.push(
      <option value={index} key={nestedItem.key}>
        {nestedItem.choice}
      </option>
    );
  }
  return arrayOfOptionElements;
};

export const Settings = () => {
  const [settings, setSettings] = useState();
  const [colorTheme, setColorTheme] = useState();

  useEffect(() => {
    onloadFetchTheme();
  }, []);

  const onloadFetchTheme = () => {
    let fetchedSettings = getUserSettings(store);
    setSettings(fetchedSettings);

    if (fetchedSettings?.colorTheme) {
      setColorTheme(fetchedSettings.colorTheme);
    }
  };

  const applyThemePostSave = (settings) => {
    setSettings(getUserSettings(store));
    if (settings?.colorTheme) {
      setColorTheme(settings.colorTheme);
    }
  };

  const promiseSaveThemeReRender = () => {
    const settings = saveUserSettings();
    applyThemePostSave(settings);
  };

  const arrayOfSettings = [];
  let counter = 1;
  for (const item of Object.entries(listOfSettings)) {
    if (item[1]?.options !== null) {
      const arrayOfOptionElements = renderDropdownOptions(item[1]);
      arrayOfSettings.push(
        <div key={counter} className="col col-6 mt-2">
          <label htmlFor={item[1].name} className="col-form-label">
            {item[1].name}
          </label>

          <select
            className="form-select full-width-button brown-input"
            aria-label={item[1].name}
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
          ></input>
        </div>
      );
    }
    counter++;
  }

  return (
    <div className="container-fluid" data-theme={colorTheme}>
      <div className="row">{arrayOfSettings}</div>
      <div className="row mt-5">
        <div className="col col-5"></div>
        <div className="col col-2">
          <SaveButton
            onClickHandler={() => {
              promiseSaveThemeReRender();
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
    </div>
  );
};
