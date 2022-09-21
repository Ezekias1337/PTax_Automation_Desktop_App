import {
  faWindowMinimize,
  faWindowMaximize,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { TitleBarButton } from "./buttons/titleBarButton";
import { closeWindow } from "../functions/window/closeWindow";
import { maximizeWindow } from "../functions/window/maximizeWindow";
import { minimizeWindow } from "../functions/window/minimizeWindow";
import logo from "../../src/images/PTax_Logo.png";
import "../css/sass_css/title-bar.scss";

export const TitleBar = () => {
  return (
    <div id="titleBar">
      <div className="row" id="titleBarRow">
        <div id="titleBarLogoContainer" className="col col-9">
          <Link to={"/"}>
            <img src={logo} className="title-logo" alt="PTax Logo" />
          </Link>
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
