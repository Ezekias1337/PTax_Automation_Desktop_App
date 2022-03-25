import { camelCasifyString } from "./camelCasifyString";
import { getWindowPosition } from "../functions/getWindowPosition";
const Store = window.require("electron-store");
const store = new Store();

export const saveUserSettings = () => {
  const arrayOfOptionElements = document.getElementsByClassName("brown-input");
  const listOfCaseSensitiveSettings = [
    "username",
    "password",
    "defaultDownloadDirectory",
    "defaultUploadandScanDirectory",
  ];

  for (const item of arrayOfOptionElements) {
    let labelInnerText;
    let labelToCamelCaseJoined;

    if (item?.type === "checkbox") {
      const textToPass = item.name;
      labelInnerText = document.querySelector(`[for='${textToPass}']`).innerText;
      labelToCamelCaseJoined = camelCasifyString(labelInnerText);
    } else {
      labelInnerText = item.previousElementSibling.innerText;
      labelToCamelCaseJoined = camelCasifyString(labelInnerText);
    }

    let inputValue;

    if (item?.options) {
      inputValue = item.options[item.selectedIndex].text;
    } else if (item?.type === "checkbox") {
      inputValue = item.checked;
    } else {
      inputValue = item.value;
    }

    if (typeof inputValue === "boolean") {
      store.set("userSettings." + labelToCamelCaseJoined, inputValue);
      if (labelToCamelCaseJoined === "launchWindowinCurrentPosition") {
        const currentScreenPosition = getWindowPosition();
        store.set(
          "userSettings." + labelToCamelCaseJoined + "value",
          currentScreenPosition
        );
      }
    } else if (!listOfCaseSensitiveSettings.includes(labelToCamelCaseJoined)) {
      store.set(
        "userSettings." + labelToCamelCaseJoined,
        inputValue.toLowerCase()
      );
    } else if (listOfCaseSensitiveSettings.includes(labelToCamelCaseJoined)) {
      store.set("userSettings." + labelToCamelCaseJoined, inputValue);
    }

    /* 
      This tells the app if the user is running this for the first time or not
    */
    store.set("userSettings.firstTimeRunning", false);
  }
  const settingsToReturn = store.get("userSettings");
  return settingsToReturn;
};
