import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { inputFieldFillDefault } from "../../functions/inputFieldFillDefault";
const { ipcRenderer } = window.require("electron");

const passFilePathToInputField = (elementID, filePath) => {
  const elementToReceiveFilePath = document.getElementById(elementID);
  elementToReceiveFilePath.value = filePath;
};

export const FileOrDirectoryPicker = (props) => {
  ipcRenderer.on("filePathRetrieved", (event, message) => {
    const id = message[1];
    const pathBackslashesReplaced = message[0].filePaths[0].replace(/\\/g, "/");
    passFilePathToInputField(id, pathBackslashesReplaced);
  });
  ipcRenderer.on("directoryPathRetrieved", (event, message) => {
    const id = message[1];

    const pathBackslashesReplaced = message[0].filePaths[0].replace(/\\/g, "/");

    passFilePathToInputField(id, pathBackslashesReplaced);
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
          onClick={() =>
            ipcRenderer.send(
              "filePrompted",
              props.data.name.split(" ").join("")
            )
          }
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
          onClick={() =>
            ipcRenderer.send(
              "directoryPrompted",
              props.data.name.split(" ").join("")
            )
          }
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
              : null
          }
        ></input>
      </div>
    );
  }
};
