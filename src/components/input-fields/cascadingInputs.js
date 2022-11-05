// Components
import { FileOrDirectoryPicker } from "./fileOrDirectoryPicker";
import { CascadingDropdown } from "./cascadingDropdown";

export const CascadingInputs = ({
  arrayOfQuestions,
  reduxState,
  parentState,
  setStateHook,
  parentChoices,
  childrenChoices,
  nonDropdownChoices,
  optionObj,
}) => {
  return (
    <>
      <CascadingDropdown
        arrayOfQuestions={arrayOfQuestions}
        parentState={parentState}
        setStateHook={setStateHook}
        parentChoices={parentChoices}
        childrenChoices={childrenChoices}
        optionObj={optionObj}
      />
      {nonDropdownChoices.map((ele, index) => {
        let inputValueState;
        if (ele.name === "Download Directory") {
          inputValueState = parentState?.downloadDirectory;
        } else if (ele.name === "Spreadsheet File") {
          inputValueState = parentState?.spreadsheetFile;
        }

        let inputToReturn;

        switch (ele.inputType) {
          case "Switch":
            break;
          case "Text Input":
            break;
          case "File":
            const tempDataObjFile = {
              name: ele.name,
              customInputType: "text",
              placeholder: "C:/Users/Name/Downloads/",
            };

            inputToReturn = (
              <FileOrDirectoryPicker
                key={index}
                data={tempDataObjFile}
                state={reduxState}
                promptType="file"
                setStateHook={setStateHook}
                inputValueState={inputValueState}
                reduxStateName="uploadDirectory"
                isFullWidth={true}
              />
            );
            break;

          case "Directory":
            const tempDataObjDirectory = {
              name: ele.name,
              customInputType: "text",
              placeholder: "C:/Users/Name/Downloads/",
            };

            inputToReturn = (
              <FileOrDirectoryPicker
                key={index}
                data={tempDataObjDirectory}
                state={reduxState}
                promptType="directory"
                setStateHook={setStateHook}
                inputValueState={inputValueState}
                reduxStateName="downloadDirectory"
                isFullWidth={true}
              />
            );
            break;

          default:
            break;
        }

        return inputToReturn;
      })}
    </>
  );
};
