import { useEffect, useState } from "react";
import { inputFieldFillDefault } from "../../functions/forms/inputFieldFillDefault";
import { camelCasifyString } from "../../utils/strings/camelCasifyString";
import { handlePathRetrieved } from "../../functions/forms/handlePathRetrieved";
import { generateEventTargetStructure } from "../../helpers/generateEventTargetStructure";
import { handleFormChange } from "../../functions/forms/handleFormChange";
const { ipcRenderer } = window.require("electron");

export const FileOrDirectoryPicker = ({
  data,
  state,
  promptType,
  setStateHook,
  inputValueState = null,
}) => {
  const [inputPromptType, setInputPromptType] = useState(null);
  const [ipcEventListener, setIpcEventListener] = useState(null);
  const [ipcEventEmitter, setIpcEventEmitter] = useState(null);

  /* 
    Prepare default value for input field if it exists
  */
  useEffect(() => {
    const inputNameCamelCasified = camelCasifyString(
      data.name.split(" ").join("")
    );
    let settingToCheckFor;

    if (promptType === "file") {
      settingToCheckFor = "downloadDirectory";
    } else if (promptType === "directory") {
      settingToCheckFor = "uploadDirectory";
    }

    const defaultInputValue = inputFieldFillDefault(
      inputNameCamelCasified,
      state,
      false,
      false,
      settingToCheckFor
    );

    if (defaultInputValue !== null) {
      const e = generateEventTargetStructure(
        inputNameCamelCasified,
        defaultInputValue
      );

      handleFormChange(e, setStateHook);
    }
  }, [data.name, setStateHook, promptType, state]);

  useEffect(() => {
    if (promptType === "file") {
      setInputPromptType("file");
    } else if (promptType === "directory") {
      setInputPromptType("directory");
    }
  }, [promptType]);

  useEffect(() => {
    if (promptType === "file") {
      setIpcEventListener("filePathRetrieved");
      setIpcEventEmitter("filePrompted");
    } else if (promptType === "directory") {
      setIpcEventListener("directoryPathRetrieved");
      setIpcEventEmitter("directoryPrompted");
    }
  }, [promptType, inputPromptType]);

  ipcRenderer.on(ipcEventListener, (event, message) => {
    handlePathRetrieved(message, setStateHook);
  });

  return (
    <div className="col col-6 mt-2">
      <label htmlFor={camelCasifyString(data.name)} className="col-form-label">
        {data.name}
      </label>
      <input
        type={data.customInputType}
        className="form-control brown-input"
        name={camelCasifyString(data.name)}
        id={camelCasifyString(data.name)}
        placeholder={data?.placeholder}
        onClick={() =>
          ipcRenderer.send(ipcEventEmitter, data.name.split(" ").join(""))
        }
        value={inputValueState !== null ? inputValueState : ""}
        onChange={() => {
          /* 
            The onChange is handled by the ipcEventListener,
            however React wants an onChange prop or it'll 
            render a read-only prop
          */
        }}
      ></input>
    </div>
  );
};
