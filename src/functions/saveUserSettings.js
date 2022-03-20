import { camelCasifyString } from "./camelCasifyString"
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
    const labelInnerText = item.previousElementSibling.innerText;
    const labelToCamelCaseJoined = camelCasifyString(labelInnerText)

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

    /* 
      This tells the app if the user is running this for the first time or not
    */
    store.set("userSettings.firstTimeRunning", false);
  }
  const settingsToReturn = store.get("userSettings");
  console.log("User settings saved!", settingsToReturn);
  return settingsToReturn;
};
