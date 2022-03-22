import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { inputFieldFillDefault } from "../../functions/inputFieldFillDefault";
import { useState } from "react";
const { ipcRenderer } = window.require("electron");

const passFilePathToInputField = (elementID, filePath) => {
  console.log(elementID, filePath)
  const elementToReceiveFilePath = document.getElementById(elementID);
  console.log(elementToReceiveFilePath)
  elementToReceiveFilePath.value = filePath;
};

export const FileOrDirectoryPicker = (props) => {
  const [filePath, setFilePath] = useState(false);
  const [directoryPath, setDirectoryPath] = useState(false);

  ipcRenderer.on("filePathRetrieved", (event, message) => {
    //setFilePath(message.filePaths[0]);
  });
  ipcRenderer.on("directoryPathRetrieved", (event, message) => {
    passFilePathToInputField(
      props.data.name.split(" ").join(""),
      message.filePaths[0]
    );
    //setDirectoryPath(message.filePaths[0]);
  });

  if (props.promptType === "file") {
    return (
      <div className="col col-6 mt-2">
        <label htmlFor={props.data.name} className="col-form-label">
          {props.data.name}
        </label>
        <input
          type={props.data.customInputType}
          className="form-control brown-input"
          name={props.data.name}
          id={props.data.name.split(" ").join("")}
          placeholder={props?.data?.placeholder}
          onClick={() => ipcRenderer.send("filePrompted")}
          defaultValue={
            inputFieldFillDefault(
              props.data.name.split(" ").join(""),
              props.state,
              false
            )
              ? inputFieldFillDefault(
                  props.data.name.split(" ").join(""),
                  props.state,
                  false
                )
              : ""
          }
        ></input>
      </div>
    );
  } else if (props.promptType === "directory") {
    return (
      <div className="col col-6 mt-2">
        <label htmlFor={props.data.name} className="col-form-label">
          {props.data.name}
        </label>
        <input
          type={props.data.customInputType}
          className="form-control brown-input"
          name={props.data.name}
          id={props.data.name.split(" ").join("")}
          placeholder={props?.data?.placeholder}
          onClick={() => ipcRenderer.send("directoryPrompted")}
          defaultValue={
            inputFieldFillDefault(
              props.data.name.split(" ").join(""),
              props.state,
              false
            )
              ? inputFieldFillDefault(
                  props.data.name.split(" ").join(""),
                  props.state,
                  false
                )
              : ""
          }
        ></input>
      </div>
    );
  }
};
