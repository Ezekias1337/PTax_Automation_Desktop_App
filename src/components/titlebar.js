import {
  faWindowMinimize,
  faWindowMaximize,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { TitleBarButton } from "./buttons/titleBarButton";
import { closeWindow } from "../functions/window/closeWindow";
import { maximizeWindow } from "../functions/window/maximizeWindow";
import { minimizeWindow } from "../functions/window/minimizeWindow";
import "../css/vanilla_css/title-bar.css";

export const TitleBar = () => {
  return (
    <div id="titleBar">
      <div className="row" id="titleBarRow">
        <div className="col col-9"></div>
        <div id="titleBarButtonContainer" className="col col-3">
          <TitleBarButton
            buttonIcon={faWindowMinimize}
            buttonClickHandler={minimizeWindow}
          />
          <TitleBarButton
            buttonIcon={faWindowMaximize}
            buttonClickHandler={maximizeWindow}
          />
          <TitleBarButton
            buttonIcon={faWindowClose}
            buttonClickHandler={closeWindow}
            isClose={true}
          />
        </div>
      </div>
    </div>
  );
};
