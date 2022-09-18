import { useEffect, useState } from "react";
/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons"; */
import { inputFieldFillDefault } from "../../functions/inputFieldFillDefault";
import { camelCasifyString } from "../../utils/camelCasifyString";
import { handlePathRetrieved } from "../../functions/ipc-renderer/handlePathRetrieved";
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
    const defaultInputValue = inputFieldFillDefault(
      data.name.split(" ").join(""),
      state,
      false,
      false
    );
    if (defaultInputValue !== null) {
      const e = generateEventTargetStructure(data.name, defaultInputValue);
      handleFormChange(e, setStateHook);
    }
  }, [data.name, setStateHook, state]);

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
        value={inputValueState}
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
