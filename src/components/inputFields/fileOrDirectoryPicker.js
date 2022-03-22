import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { inputFieldFillDefault } from "../../functions/inputFieldFillDefault";
const { ipcRenderer } = window.require("electron");

export const FileOrDirectoryPicker = (props) => {
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
