// Library Imports
import {
  faWindowMinimize,
  faWindowMaximize,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
// Functions, Helpers, Utils, and Hooks
import { closeWindow } from "../../functions/window/closeWindow";
import { maximizeWindow } from "../../functions/window/maximizeWindow";
import { minimizeWindow } from "../../functions/window/minimizeWindow";
// Components
import { TitleBarButton } from "../buttons/titleBarButton";
// CSS
import "../../css/title-bar.scss";
// Assets and Images
import logo from "../../../src/images/PTax_Logo.png";

export const TitleBar = () => {
  return (
    <div id="titleBar">
      <div className="row" id="titleBarRow">
        <div id="titleBarLogoContainer" className="col col-9">
          <img src={logo} className="title-logo" alt="PTax Logo" />
        </div>
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
            buttonIcon={faXmark}
            buttonClickHandler={closeWindow}
            isClose={true}
          />
        </div>
      </div>
    </div>
  );
};
